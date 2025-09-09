using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using YugiApi.Models;

namespace YugiApi.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Card> Cards { get; set; }
        public DbSet<ApiCardImage> ApiCardImages { get; set; }
        public DbSet<Deck> Decks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

  

            builder.Entity<Deck>()
                .HasMany(d => d.Cards)
                .WithMany()
                .UsingEntity(j => j.ToTable("DeckCards"));

  
        }
    }
}
