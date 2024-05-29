using Microsoft.EntityFrameworkCore;
using Project_II.Server.Models;

namespace Project_II.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Pool> Pools { get; set; }

        public DbSet<Trainers> Trainers { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Climbing> Climbing { get; set; }

        public DbSet<Booking> Booking { get; set; }
        public DbSet<Subscription> Subscription { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.User_id);
            modelBuilder.Entity<Pool>().HasKey(u => u.Polol_id);
            modelBuilder.Entity<Climbing>().HasKey(u => u.Climbing_id);
            modelBuilder.Entity<Trainers>().HasKey(u => u.Trainer_id);
            modelBuilder.Entity<Equipment>().HasKey(u => u.Equipment_id);
            modelBuilder.Entity<Booking>().HasKey(u => u.Booking_id);
            modelBuilder.Entity<Subscription>().HasKey(u => u.Subscription_id);

        }
    }
}

