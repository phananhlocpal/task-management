using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using backend.Repositories.UserRepo;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenController : ControllerBase
    {
        private readonly IUserRepo _userRepo;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthenController(IUserRepo userRepo, IConfiguration configuration)
        {
            _userRepo = userRepo;
            _config = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(SignUpVM model)
        {
            var existingUser = await _userRepo.GetUserByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "User with this email already exists." });
            }

            var newUser = new User
            {
                Name = model.Name,
                Email = model.Email,
                Role = model.Role,
                EmailConfirmed = false,
                VerificationToken = Guid.NewGuid().ToString()
            };

            // Hash the password
            newUser.Password = _passwordHasher.HashPassword(newUser, model.Password);

            await _userRepo.AddUserAsync(newUser);

            SendVerificationEmail(newUser);

            return Ok(new { message = "User registered successfully. Please check your email to verify your account." });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginVM model)
        {
            var user = await _userRepo.GetUserByEmailAsync(model.Email);

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password) != PasswordVerificationResult.Success)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Generate JWT token
            var tokenString = GenerateJSONWebToken(user);

            // Return both the token and user information
            var userInfo = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role,
                token = tokenString
            };

            return Ok(userInfo); 
        }

        [AllowAnonymous]
        [HttpGet("verifyemail")]
        public async Task<IActionResult> VerifyEmail(string token)
        {
            var user = await _userRepo.GetUserByEmailTokenAsync(token);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid token" });
            }

            user.EmailConfirmed = true;
            user.VerificationToken = null;
            await _userRepo.UpdateUserAsync(user);

            return Ok(new { message = "Email verified successfully!" });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully." });
        }

        private string GenerateJSONWebToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim("ID", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SendVerificationEmail(User user)
        {
            var verificationLink = Url.Action("VerifyEmail", "Authen", new { token = user.VerificationToken }, Request.Scheme);
            var emailContent = $"Please verify your email by clicking the following link: {verificationLink}";

            var smtpClient = new SmtpClient(_config["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(_config["EmailSettings:SmtpPort"]),
                Credentials = new NetworkCredential(_config["EmailSettings:SenderEmail"], _config["EmailSettings:SenderPassword"]),
                EnableSsl = true,
            };

            smtpClient.Send(_config["EmailSettings:SenderEmail"], user.Email, "Email Verification", emailContent);
        }
    }
}
