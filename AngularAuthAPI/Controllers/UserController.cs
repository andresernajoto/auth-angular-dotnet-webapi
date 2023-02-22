using System.Reflection.Emit;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularAuthAPI.Context;
using AngularAuthAPI.Helpers;
using AngularAuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace AngularAuthAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context) {
            _context = context;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj) {
            if (userObj == null) { return BadRequest(); }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == userObj.Username);

            if (user == null) { return NotFound(new { Message = "User not found!" }); }

            if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password)) { return BadRequest(new { Message = "Password is incorret!" }); }

            user.Token = CreateJwtToken(user);

            return Ok(new {
                Token = user.Token,
                Message = "User logged successfully!"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User userObj) {
            if (userObj == null) { return BadRequest(); }

            // check username
            if (await CheckUsernameExistAsync(userObj.Username)) { return BadRequest(new { Message = "Username already exists!" }); }

            // check email
            if (await CheckEmailExistAsync(userObj.Email)) { return BadRequest(new { Message = "This email is already being used!" }); }

            // check password strength
            var pass = CheckPasswordStrength(userObj.Password);

            if (!string.IsNullOrEmpty(pass)) { return BadRequest(new { Message = pass.ToString() });}

            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";

            await _context.Users.AddAsync(userObj);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully!"});
        }

        private async Task<bool> CheckUsernameExistAsync(string username) {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        private async Task<bool> CheckEmailExistAsync(string email) {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        private string CheckPasswordStrength(string password) {
            StringBuilder sb = new();

            if (password.Length < 9) { sb.Append("Minimum password length should be 8" + Environment.NewLine); }

            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]"))) {
                sb.Append("Password should be alphanumeric" + Environment.NewLine);
            }
            
            if ((!Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,~,`,-,=]"))) { sb.Append("Password should contain any special character" + Environment.NewLine); }

            return sb.ToString();
        }

        private string CreateJwtToken(User userObj) {
            JwtSecurityTokenHandler jwtTokenHandler = new();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identity = new ClaimsIdentity(new Claim[] {
                new Claim(ClaimTypes.Role, userObj.Role),
                new Claim(ClaimTypes.Name, $"{userObj.FirstName} {userObj.LastName}")
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);
        }

        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers() {
            return Ok(await _context.Users.ToListAsync());
        }
    }
}