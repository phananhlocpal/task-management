using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Entities;

namespace backend.Repositories.UserRepo
{
    public class UserRepo : IUserRepo
    {
        private readonly TaskManagementDBContext _context;

        public UserRepo(TaskManagementDBContext context)
        {
            _context = context;
        }

        // Get all users
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        // Get a user by ID
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        // Get a user by email
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        }

        // Get a user by verification token
        public async Task<User> GetUserByEmailTokenAsync(string token)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.VerificationToken == token);
        }

        // Search functionality by name
        public async Task<IEnumerable<User>> SearchUsersByNameAsync(string name)
        {
            return await _context.Users
                                 .Where(u => u.Name.Contains(name))
                                 .ToListAsync();
        }

        // Add a new user
        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        // Update an existing user
        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        // Delete a user
        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        // Check if a user exists by ID
        public async Task<bool> UserExistsAsync(int id)
        {
            return await _context.Users.AnyAsync(u => u.Id == id);
        }
    }
}
