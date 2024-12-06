using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoginVM
    {
        [Display(Name = "Email đăng nhập")]
        public string Email { get; set; }

        [Display(Name = "Mật khẩu")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
