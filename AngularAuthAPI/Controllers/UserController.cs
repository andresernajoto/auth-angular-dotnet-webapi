using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularAuthAPI.Context;
using AngularAuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == userObj.Username && u.Password == userObj.Password);

            if (user == null) { return NotFound(new { Message = "User not found!" }); }

            return Ok(new { Message = "User logged successfully!"});
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User userObj) {
            if (userObj == null) { return BadRequest(); }

            await _context.Users.AddAsync(userObj);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully!"});
        }
    }
}