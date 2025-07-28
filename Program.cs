using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using tasinmazBackend.Data;
using tasinmazBackend.Services.Interfaces;
using tasinmazBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// CORS Policy (GEÇİCİ OLARAK TÜM KAYNAKLARA İZİN VERİYORUZ - DEBUG AMAÇLI)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy => // Politika adını değiştirdik
    {
        policy.AllowAnyOrigin() // Tüm kaynaklardan gelen isteklere izin ver
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// DbContext (PostgreSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servisleri ekle
builder.Services.AddScoped<IIlService, IlService>();
builder.Services.AddScoped<IIlceService, IlceService>();
builder.Services.AddScoped<IMahalleService, MahalleService>();
builder.Services.AddScoped<ITasinmazService, TasinmazService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILogService, LogService>();

builder.Services.AddHttpContextAccessor();

// JWT Authentication ayarları
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("Key"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidateAudience = true,
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS middleware'i, kimlik doğrulama/yetkilendirme middleware'lerinden ÖNCE gelmeli
app.UseCors("AllowAllOrigins"); // Politika adını değiştirdik ve buraya uyguladık

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
