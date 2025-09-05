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

  

            // Many-to-many veza za Cards u decku
            builder.Entity<Deck>()
                .HasMany(d => d.Cards)
                .WithMany()
                .UsingEntity(j => j.ToTable("DeckCards"));

            // Many-to-many veza za Graveyard
            builder.Entity<Deck>()
                .HasMany(d => d.Graveyard)
                .WithMany()
                .UsingEntity(j => j.ToTable("DeckGraveyard"));

            // Many-to-many veza za Banished
            builder.Entity<Deck>()
                .HasMany(d => d.Banished)
                .WithMany()
                .UsingEntity(j => j.ToTable("DeckBanished"));
        }
    }
}
