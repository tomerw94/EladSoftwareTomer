using Microsoft.EntityFrameworkCore;
using tomerExam.Dal;
using tomerExam.Interfaces;
using tomerExam.Models;

namespace tomerExam.Queries
{
    public class UserQueries : IUserQueries
    {
        private readonly ILogger<UserQueries> _logger;
        private readonly AppDbContext _dbContext;

        public UserQueries(ILogger<UserQueries> logger, AppDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        public async Task<User> AddUser(User user)
        {
            _logger.LogInformation($"AddUser - Enter");
            var addedEntity = _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            addedEntity.State = EntityState.Detached;
            _logger.LogInformation($"AddUser - Exit");
            return addedEntity.Entity;
        }

        public async Task<User> DeleteUserById(int id)
        {
            _logger.LogInformation($"DeleteUserById - Enter");
            var userToDelete = new User { Id = id };
            var deletedEntity = _dbContext.Users.Remove(userToDelete);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"DeleteUserById - Exit");
            return deletedEntity.Entity;
        }

        public async Task<IList<User>> GetAllUser()
        {
            _logger.LogInformation($"GetAllUser - Enter");
            var retValue = await _dbContext.Users
                .AsNoTracking()
                .ToListAsync(); // not including policies when asking for all the users
            _logger.LogInformation($"GetAllUser - Exit");
            return retValue;
        }

        public async Task<User> GetUserById(int id)
        {
            _logger.LogInformation($"GetUserById - Enter");
            var retValue = await _dbContext.Users
                .AsNoTracking()
                .Include(u => u.InsurancePolicies) // when asking for specific user would need his policies too
                .FirstOrDefaultAsync(user => user.Id == id);
            _logger.LogInformation($"GetUserById - Exit");
            return retValue;
        }

        public async Task<User> UpdateUser(User user)
        {
            _logger.LogInformation($"UpdateUser - Enter");
            var updatedEntity = _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"UpdateUser - Exit");
            return updatedEntity.Entity;
        }
    }
}
