using Domain.Interfaces.Auth;
using Domain.Models;
using FMS.Server.Handlers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

//using Services.CalculateScore;
//using Services.Form;
using Services.Implements.Auth;
using System.Globalization;
using System.Reflection;
using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {

        var cultureInfo = new CultureInfo("th-TH");
        CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
        CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;


        var builder = WebApplication.CreateBuilder(args);

        var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        // 2. Add CORS service
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: MyAllowSpecificOrigins,
                policy =>
                {
                    policy.WithOrigins("http://localhost:4200") // ใส่ origin ที่อนุญาต
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });



        builder.Services.AddDbContext<MYGAMEContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        // ✅ Register LoginService
        //builder.Services.AddScoped<ILoginService, LoginService>();
        //builder.Services.AddScoped<ILoginService, LoginService>();
        //builder.Services.AddScoped<IMemberRegisterService,MemberRegisterService>();
        //builder.Services.AddScoped<IUserRegisterService, UserRegisterService>();
        ////builder.Services.AddScoped<IUserLoginService, LoginService>();
        //builder.Services.AddScoped<IUserLoginService, UserLoginService>();
        //builder.Services.AddScoped<IInsertFormService , InsertFormService>();
        builder.Services.AddScoped<IPasswordHasher<object>, PasswordHasher<object>>();


        //builder.Services.AddScoped<CalculateScore>();
        //builder.Services.AddScoped<WordDataService>();

        var interfaceAssembly = Assembly.GetAssembly(typeof(IAuthenticationService)).GetTypes().Where(x => x.Name.EndsWith("Service"));
        var assembly = Assembly.GetAssembly(typeof(AuthenticationService)).GetTypes().Where(x => x.Name.EndsWith("Service"));
        foreach (var @interface in interfaceAssembly)
        {
            var interfaceName = @interface.Name;
            var implement = assembly.FirstOrDefault(c => c.IsClass && interfaceName.Substring(1) == c.Name);
            if (implement != null)
                builder.Services.AddScoped(@interface, implement);

        }

        SetupSecurity(builder);

        builder.Services.AddAuthorization();

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();
        app.UseGlobalExceptionHandler();
        app.UseCors(MyAllowSpecificOrigins);


        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }

    private static void SetupSecurity(WebApplicationBuilder builder)
    {
        var jwtSettings = builder.Configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

        // เพิ่ม JWT Authentication
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };
        });
    }
}