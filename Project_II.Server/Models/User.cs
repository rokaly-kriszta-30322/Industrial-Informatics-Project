namespace Project_II.Server.Models
{
    public class User
    {
        public int User_id { get; }
        public string User_name { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
