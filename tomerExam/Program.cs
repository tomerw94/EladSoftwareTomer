using Microsoft.EntityFrameworkCore;
using tomerExam.Dal;
using tomerExam.Interfaces;
using tomerExam.Queries;
using tomerExam.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlite("Data Source=Exam.db"));
builder.Services.AddScoped<IUserQueries, UserQueries>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IInsurancePolicyQueries, InsurancePolicyQueries>();
builder.Services.AddScoped<IInsurancePolicyService, InsurancePolicyService>();
builder.Services.AddSingleton(typeof(IAutoMapperService), typeof(AutoMapperService));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.UseCors("AllowOrigin");
app.MapControllers();

app.Run();
