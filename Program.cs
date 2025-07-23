using Microsoft.EntityFrameworkCore;
using tasinmazBackend.Data;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;
using tasinmazBackend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IlService, IlService>();
builder.Services.AddScoped<IlceService, IlceService>();
builder.Services.AddScoped<IMahalleService, MahalleService>();
builder.Services.AddScoped<ITasinmazService, TasinmazService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!context.Iller.Any())
    {
        // İl ekle
        var il1 = new Il { Ad = "İstanbul" };
        var il2 = new Il { Ad = "Ankara" };
        var il3 = new Il { Ad = "İzmir" };
        context.Iller.AddRange(il1, il2, il3);
        context.SaveChanges();

        // İlçe ekle
        var ilce1 = new Ilce { Ad = "Kadıköy", IlId = il1.Id };
        var ilce2 = new Ilce { Ad = "Çankaya", IlId = il2.Id };
        var ilce3 = new Ilce { Ad = "Konak", IlId = il3.Id };
        context.Ilceler.AddRange(ilce1, ilce2, ilce3);
        context.SaveChanges();

        // Mahalle ekle
        var mahalle1 = new Mahalle { Ad = "Moda", IlceId = ilce1.Id };
        var mahalle2 = new Mahalle { Ad = "Kızılay", IlceId = ilce2.Id };
        var mahalle3 = new Mahalle { Ad = "Alsancak", IlceId = ilce3.Id };
        context.Mahalleler.AddRange(mahalle1, mahalle2, mahalle3);
        context.SaveChanges();

        Console.WriteLine("İl, İlçe ve Mahalle verileri başarıyla eklendi.");
    }
    else
    {
        Console.WriteLine("Veritabanında zaten İl, İlçe ve Mahalle verileri var, ekleme yapılmadı.");
    }
}

app.Run();
