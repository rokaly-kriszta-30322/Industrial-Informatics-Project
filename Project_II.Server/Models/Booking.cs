namespace Project_II.Server.Models
{
    public class Booking
    {
        public int Booking_id { get; set; }
        public int User_id { get; set; }
        public int Trainer_id { get; set; }
        public int Day { get; set; }
        public int Hour { get; set; }
    }
}
