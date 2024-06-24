using Microsoft.AspNetCore.Mvc;
using tomerExam.Interfaces;
using tomerExam.Models.Dto;
using tomerExam.Models;
using tomerExam.Services;

namespace tomerExam.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InsurancePolicyController : ControllerBase
    {
        private readonly ILogger<InsurancePolicyController> _logger;
        private readonly IInsurancePolicyService _insurancePolicyService;
        private readonly IAutoMapperService _autoMapper;

        public InsurancePolicyController(ILogger<InsurancePolicyController> logger, IInsurancePolicyService insurancePolicyService, IAutoMapperService autoMapper)
        {
            _logger = logger;
            _insurancePolicyService = insurancePolicyService;
            _autoMapper = autoMapper;
        }
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<InsurancePolicyDto>>> GetALlInsurancePolicies()
        {
            var allInsurancePolicies = await _insurancePolicyService.GetAllInsurancePolicies();
            if (allInsurancePolicies == null)
            {
                var errMsg = "Failed to get all insurancePolicies";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }
            var allInsurancePoliciesDto = _autoMapper.Mapper.Map<List<InsurancePolicyDto>>(allInsurancePolicies);
            return allInsurancePoliciesDto;
        }
        [HttpGet("byUser")]
        //[Authorize]
        public async Task<ActionResult<List<InsurancePolicyDto>>> GetInsurancePoliciesByUserId([FromRoute] int userId)
        {
            var userInsurancePolicies = await _insurancePolicyService.GetInsurancePoliciesByUserId(userId);
            if (userInsurancePolicies == null)
            {
                var errMsg = $"Failed to get user insurancePolicies of userId{userId}";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }
            var userInsurancePoliciesDto = _autoMapper.Mapper.Map<List<InsurancePolicyDto>>(userInsurancePolicies);
            return userInsurancePoliciesDto;
        }

        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<InsurancePolicyDto>> GetInsurancePolicyById([FromRoute] int id)
        {
            if (id <= 0)
            {
                var errMsg = $"Failed to get insurancePolicy with invalid id '{id}'";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var insurancePolicy = await _insurancePolicyService.GetInsurancePolicyById(id);
            if (insurancePolicy == null)
            {
                var errMsg = $"Failed to get insurancePolicy with id '{id}. InsurancePolicy not found'";
                _logger.LogError(errMsg);
                return NotFound(errMsg);
            }
            var insurancePolicyDto = _autoMapper.Mapper.Map<InsurancePolicyDto>(insurancePolicy);
            return insurancePolicyDto;
        }

        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<InsurancePolicyDto>> AddInsurancePolicy([FromBody] InsurancePolicyDto insurancePolicyDto)
        {
            if (insurancePolicyDto == null)
            {
                var errMsg = $"Input insurancePolicyDto dto model is invalid";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var insurancePolicy = _autoMapper.Mapper.Map<InsurancePolicy>(insurancePolicyDto);
            var addedInsurancePolicy = await _insurancePolicyService.AddInsurancePolicy(insurancePolicy);
            if (addedInsurancePolicy == null)
            {
                var errMsg = $"Failed to add insurancePolicy. Check logs";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var addedInsurancePolicyDto = _autoMapper.Mapper.Map<InsurancePolicyDto>(addedInsurancePolicy);
            return addedInsurancePolicyDto;
        }

        [HttpPut]
        //[Authorize]
        public async Task<ActionResult<InsurancePolicyDto>> UpdateInsurancePolicyD([FromBody] InsurancePolicyDto insurancePolicyDto)
        {
            var insurancePolicy = _autoMapper.Mapper.Map<InsurancePolicy>(insurancePolicyDto);
            InsurancePolicy updatedInsurancePolicy = null;
            try
            {
                updatedInsurancePolicy = await _insurancePolicyService.UpdateInsurancePolicy(insurancePolicy);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception occurred while trying to updated insurancePolicy '{insurancePolicyDto.Id}'");
            }

            if (updatedInsurancePolicy == null)
            {
                var errMsg = $"Failed to update insurancePolicy with id '{insurancePolicyDto.Id}'. Check logs";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var updatedInsurancePolicyDto = _autoMapper.Mapper.Map<InsurancePolicyDto>(updatedInsurancePolicy);
            return updatedInsurancePolicyDto;
        }

        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<ActionResult<InsurancePolicyDto>> DeleteInsurancePolicyById([FromRoute] int id)
        {
            if (id <= 0)
            {
                var errMsg = $"Failed to delete insurancePolicy with invalid id '{id}'";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            InsurancePolicy insurancePolicy = null;
            try
            {
                insurancePolicy = await _insurancePolicyService.DeleteInsurancePolicyById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception occurred while trying to delete insurancePolicy '{id}'");
            }

            if (insurancePolicy == null)
            {
                var errMsg = $"Failed to delete insurancePolicy with id '{id}'. Check logs";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var deletedInsurancePolicyDto = _autoMapper.Mapper.Map<InsurancePolicyDto>(insurancePolicy);
            return deletedInsurancePolicyDto;
        }
    }
}
