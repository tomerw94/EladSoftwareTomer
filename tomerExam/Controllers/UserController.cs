using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tomerExam.Interfaces;
using tomerExam.Models;
using tomerExam.Models.Dto;

namespace tomerExam.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IUserService _usersService;
        private readonly IAutoMapperService _autoMapper;

        public UsersController(ILogger<UsersController> logger, IUserService userService, IAutoMapperService autoMapper)
        {
            _logger = logger;
            _usersService = userService;
            _autoMapper = autoMapper;
        }

        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            var allUsers = await _usersService.GetAllUser();
            if (allUsers == null)
            {
                var errMsg = "Failed to get all users";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }
            var allUsersDto = _autoMapper.Mapper.Map<List<UserDto>>(allUsers);
            return allUsersDto;
        }

        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<UserDto>> GetUserById([FromRoute] int id)
        {
            if (id <= 0)
            {
                var errMsg = $"Failed to get user with invalid id '{id}'";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var user = await _usersService.GetUserById(id);
            if (user == null)
            {
                var errMsg = $"Failed to get user with id '{id}. User not found'";
                _logger.LogError(errMsg);
                return NotFound(errMsg);
            }
            var UserDto = _autoMapper.Mapper.Map<UserDto>(user);
            return UserDto;
        }

        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<UserDto>> AddUser([FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                var errMsg = $"Input user dto model is invalid";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var user = _autoMapper.Mapper.Map<User>(userDto);
            var addedUser = await _usersService.AddUser(user);
            if (addedUser == null)
            {
                var errMsg = $"Failed to add user. Check logs";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var addedUserDto = _autoMapper.Mapper.Map<UserDto>(addedUser);
            return addedUserDto;
        }

        [HttpPut]
        //[Authorize]
        public async Task<ActionResult<UserDto>> UpdateUser([FromBody] UserDto userDto)
        {               
            var user = _autoMapper.Mapper.Map<User>(userDto);
            User updatedUser = null;
            try
            {
                updatedUser = await _usersService.UpdateUser(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception occurred while trying to updated user '{userDto.Id}'");
            }

            if (updatedUser == null)
            {
                var errMsg = $"Failed to update user with id '{userDto.Id}'. Check logs";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var updatedUserDto = _autoMapper.Mapper.Map<UserDto>(updatedUser);
            return updatedUserDto;
        }

        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<ActionResult<UserDto>> DeleteUserById([FromRoute] int id)
        {
            if (id <= 0)
            {
                var errMsg = $"Failed to delete user with invalid id '{id}'";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            User user = null;
            try
            {
                user = await _usersService.DeleteUserById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception occurred while trying to delete user '{id}'");
            }

            if (user == null)
            {
                var errMsg = $"Failed to delete user with id '{id}'. Check logs";
                _logger.LogError(errMsg);
                return BadRequest(errMsg);
            }

            var deletedUserDto = _autoMapper.Mapper.Map<UserDto>(user);
            return deletedUserDto;
        }
                
    }
}
