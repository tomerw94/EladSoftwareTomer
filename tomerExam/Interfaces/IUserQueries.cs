using tomerExam.Models;

namespace tomerExam.Interfaces
{
    public interface IUserQueries
    {
        Task<IList<User>> GetAllUser();

        Task<User> GetUserById(int id);

        Task<User> AddUser(User user);

        Task<User> UpdateUser(User user);

        Task<User> DeleteUserById(int id);
    }
}
