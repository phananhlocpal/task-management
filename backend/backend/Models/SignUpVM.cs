using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class SignUpVM
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(50)]
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Status { get; set; } = "Active";
        public bool EmailConfirmed { get; set; } = false;
        public string? VerificationToken { get; set; } = null;
    }
}
