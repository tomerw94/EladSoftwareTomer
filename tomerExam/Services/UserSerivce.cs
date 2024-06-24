using tomerExam.Models;
using tomerExam.Interfaces;

namespace tomerExam.Services
{   
    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _logger;
        private readonly IUserQueries _userQueries;

        public UserService(ILogger<UserService> logger, IUserQueries userQueries)
        {
            _logger = logger;
            _userQueries = userQueries;
        }

        public async Task<User> GetUserById(int id)
        {
            _logger.LogInformation($"GetUserById - Enter");
            var retValue = await _userQueries.GetUserById(id);
            _logger.LogInformation($"GetUserById - Exit");
            return retValue;
        }

        public async Task<User> AddUser(User user)
        {
            _logger.LogInformation($"AddUser - Enter");
            var retValue = await _userQueries.AddUser(user);
            _logger.LogInformation($"AddUser - Exit");
            return retValue;
        }

        public async Task<User> UpdateUser(User user)
        {
            _logger.LogInformation($"UpdateUser - Enter");
            var retValue = await _userQueries.UpdateUser(user);
            _logger.LogInformation($"UpdateUser - Exit");
            return retValue;
        }

        public async Task<User> DeleteUserById(int id)
        {
            _logger.LogInformation($"DeleteUserById - Enter");
            var retValue = await _userQueries.DeleteUserById(id);
            _logger.LogInformation($"DeleteUserById - Exit");
            return retValue;
        }

        public async Task<IList<User>> GetAllUser()
        {
            _logger.LogInformation($"GetAllUser - Enter");
            var retValue = await _userQueries.GetAllUser();
            _logger.LogInformation($"GetAllUser - Exit");
            return retValue;
        }
    }
}
