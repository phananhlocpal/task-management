using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Entities;

namespace backend.Repositories.UserRepo
{
    public interface IUserRepo
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByEmailTokenAsync(string token);
        Task<IEnumerable<User>> SearchUsersByNameAsync(string name);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
        Task<bool> UserExistsAsync(int id);
    }
}
