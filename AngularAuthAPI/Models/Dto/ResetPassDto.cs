using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularAuthAPI.Models.Dto
{
    public record ResetPassDto
    {
        public string Email { get; set; } = string.Empty;
        public string EmailToken { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassWord { get; set; } = string.Empty;
    }
}