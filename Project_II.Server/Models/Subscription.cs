namespace Project_II.Server.Models
{
    public class Subscription
    {
        public int Subscription_id { get; }
        public string Type { set; get; }
        public DateTime Time_sub { set; get; }
        public int User_id { set; get; }
    }
}
