using AutoMapper;
using tomerExam.Interfaces;
using tomerExam.Models.Dto;
using tomerExam.Models;

namespace tomerExam.Services
{
    public class AutoMapperService : IAutoMapperService
    {
        public IMapper Mapper { get; }

        public AutoMapperService()
        {
            var config = new MapperConfiguration(InitMapper);
            Mapper = new Mapper(config);
            config.AssertConfigurationIsValid();
        }

        private void InitMapper(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<User, UserDto>()
                .ReverseMap();
            cfg.CreateMap<InsurancePolicy, InsurancePolicyDto>()
                .ReverseMap();
        }

    }
}
