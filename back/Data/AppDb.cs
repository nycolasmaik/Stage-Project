using Microsoft.EntityFrameworkCore;
using Stage_API.Models;
using System.Data;

namespace Stage_API.Data
{
    public class AppDb : DbContext
    {
        public AppDb(DbContextOptions<AppDb> options) : base(options) { }

        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<Area> Area { get; set; }
        public DbSet<Processo> Processo { get; set; }
    }
}
