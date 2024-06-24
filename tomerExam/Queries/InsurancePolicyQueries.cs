using Microsoft.EntityFrameworkCore;
using tomerExam.Dal;
using tomerExam.Interfaces;
using tomerExam.Models;

namespace tomerExam.Queries
{
    public class InsurancePolicyQueries : IInsurancePolicyQueries
    {
        private readonly ILogger<InsurancePolicyQueries> _logger;
        private readonly AppDbContext _dbContext;

        public InsurancePolicyQueries(ILogger<InsurancePolicyQueries> logger, AppDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        public async Task<InsurancePolicy> AddInsurancePolicy(InsurancePolicy insurancePolicy)
        {
            _logger.LogInformation($"AddInsurancePolicy - Enter");
            var existingUser = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == insurancePolicy.UserId);
            if (existingUser == null)
            {
                _logger.LogError($"Error: Couldn't find user with userId={insurancePolicy.UserId} to create insurancePolicy");
                return null;
            }
            var addedEntity = _dbContext.InsurancePolicies.Add(insurancePolicy);
            await _dbContext.SaveChangesAsync();
            addedEntity.State = EntityState.Detached;
            _logger.LogInformation($"AddInsurancePolicy - Exit");
            return addedEntity.Entity;
        }

        public async Task<InsurancePolicy> DeleteInsurancePolicyById(int id)
        {
            _logger.LogInformation($"DeleteInsurancePolicyById - Enter");
            var insurancePolicyToDelete = new InsurancePolicy { Id = id };
            var deletedEntity = _dbContext.InsurancePolicies.Remove(insurancePolicyToDelete);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"DeleteInsurancePolicyById - Exit");
            return deletedEntity.Entity;
        }

        public async Task<IList<InsurancePolicy>> GetAllInsurancePolicy()
        {
            _logger.LogInformation($"GetAllInsurancePolicy - Enter");
            var retValue = await _dbContext.InsurancePolicies.AsNoTracking().ToListAsync();
            _logger.LogInformation($"GetAllInsurancePolicy - Exit");
            return retValue;
        }

        public async Task<InsurancePolicy> GetInsurancePolicyById(int id)
        {
            _logger.LogInformation($"GetInsurancePolicyById - Enter");
            var retValue = await _dbContext.InsurancePolicies.AsNoTracking().FirstOrDefaultAsync(insurancePolicy => insurancePolicy.Id == id);
            _logger.LogInformation($"GetInsurancePolicyById - Exit");
            return retValue;
        }

        public async Task<IList<InsurancePolicy>> GetInsurancePolicyByUserId(int userId)
        {
            _logger.LogInformation($"GetAllInsurancePolicy - Enter");
            var retValue = await _dbContext.InsurancePolicies.AsNoTracking()
                .Where(insurancePolicy => insurancePolicy.UserId == userId)
                .ToListAsync();
            _logger.LogInformation($"GetAllInsurancePolicy - Exit");
            return retValue;
        }

        public async Task<InsurancePolicy> UpdateInsurancePolicy(InsurancePolicy insurancePolicy)
        {
            _logger.LogInformation($"UpdateInsurancePolicy - Enter");
            var updatedEntity = _dbContext.InsurancePolicies.Update(insurancePolicy);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"UpdateInsurancePolicy - Exit");
            return updatedEntity.Entity;
        }
    }
}
