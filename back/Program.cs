using Microsoft.EntityFrameworkCore;
using Stage_API.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// GET na conexão do banco MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//Referencia do Banco de Dados (MySQL)
builder.Services.AddDbContext<AppDb>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // A porta onde seu React está rodando
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

//Abrir Swagger no ambiente de Desenvolvimento (LocalHost)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
