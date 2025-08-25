using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YugiApi.Dtos;
using YugiApi.Models;
using YugiApi.Repositories.Interfaces;
using YugiApi.Services;

namespace YugiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenService _tokenService;

        public UserController(IUserRepository userRepository, TokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var existingEmail = await _userRepository.GetByEmailAsync(registerDto.Email);
            if (existingEmail != null)
            {
                ModelState.AddModelError("email", "Email already taken");
                return ValidationProblem();
            }

            var existingUsername = await _userRepository.GetByEmailAsync(registerDto.UserName);
            if (existingUsername != null)
            {
                ModelState.AddModelError("username", "Username already taken");
                return ValidationProblem();
            }

            var user = new User
            {
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userRepository.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null) return BadRequest("User doesnt exists");

            var passwordValid = await _userRepository.CheckPasswordAsync(user, loginDto.Password);
            if (!passwordValid) return BadRequest("Wrong password");

            return CreateUserObject(user);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return Unauthorized();

            return CreateUserObject(user);
        }

       
        private UserDto CreateUserObject(User user)
        {
            return new UserDto
            {
                Username = user.UserName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}
