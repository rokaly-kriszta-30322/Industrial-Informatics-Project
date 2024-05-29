using Project_II.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_II.Server.Models;


namespace Project_FitnessApp.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class Fitness_AppController : Controller

    {
        private readonly MyDbContext _myDbContext;
        public Fitness_AppController(MyDbContext myDbContext)
        { _myDbContext = myDbContext; }




        // FOR USERS:

        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _myDbContext.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("GetUser/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _myDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }
            return Ok(user);
        }

        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] User userRequest)
        {
            await _myDbContext.AddAsync(userRequest);
            await _myDbContext.SaveChangesAsync();
            return Ok(userRequest);
        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _myDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            _myDbContext.Users.Remove(user);
            await _myDbContext.SaveChangesAsync();

            return Ok("User deleted successfully");
        }


        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, User userRequest)
        {

            var existingUser = await _myDbContext.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.User_name = userRequest.User_name;
            existingUser.Email = userRequest.Email;
            existingUser.Password = userRequest.Password;
            existingUser.Role = userRequest.Role;

            try
            {
                _myDbContext.Users.Update(existingUser);
                await _myDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("User updated successfully");
        }


        private bool UserExists(int id)
        {
            return _myDbContext.Users.Any(e => e.User_id == id);
        }

        [HttpGet("GetUserByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _myDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(new { user.User_id, user.User_name, user.Password, user.Role, user.Email });
        }

        [HttpGet("GetUserByEmailAuth/{email}")]
        public async Task<IActionResult> GetUserByEmailAuth(string email)
        {
            var user = await _myDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return Ok(null);
            }

            return Ok(new { user.User_id, user.User_name, user.Password, user.Role, user.Email });
        }



        // FOR POOLS: 

        [HttpGet("GetAllPools")]

        public async Task<IActionResult> GetAllPools()
        {
            var pools = await _myDbContext.Pools.ToListAsync();
            return Ok(pools);
        }

        [HttpGet("GetPool/{id}")]
        public async Task<IActionResult> GetPool(int id)
        {
            var pool = await _myDbContext.Pools.FindAsync(id);
            if (pool == null)
            {
                return NotFound("Pool not found");
            }
            return Ok(pool);
        }

        [HttpPost("AddPool")]

        public async Task<IActionResult> AddPool([FromBody] Pool poolRequest)
        {
            await _myDbContext.AddAsync(poolRequest);
            await _myDbContext.SaveChangesAsync();
            return Ok(poolRequest);
        }

        [HttpDelete("DeletePool/{id}")]

        public async Task<IActionResult> DeletePool(int id)
        {
            var pool = await _myDbContext.Pools.FindAsync(id);
            if (pool == null)
            {
                return NotFound("Pool not found");
            }

            _myDbContext.Pools.Remove(pool);
            await _myDbContext.SaveChangesAsync();
            return Ok("Pool deleted successfully");
        }

        [HttpPut("UpdatePool/{id}")]

        public async Task<IActionResult> UpdatePool(int id, Pool poolRequest)
        {

            var existingPool = await _myDbContext.Pools.FindAsync(id);
            if (existingPool == null)
            {
                return NotFound();
            }

            existingPool.Pool_name = poolRequest.Pool_name;
            existingPool.Pool_depth = poolRequest.Pool_depth;
            existingPool.Temp = poolRequest.Temp;

            try
            {
                _myDbContext.Pools.Update(existingPool);
                await _myDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PoolExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Pool updated successfully");
        }

        private bool PoolExists(int id)
        {
            return _myDbContext.Pools.Any(e => e.Polol_id == id);
        }






        // FOR CLIMBING: 

        [HttpGet("GetAllWalls")]

        public async Task<IActionResult> GetAllWalls()
        {
            var walls = await _myDbContext.Climbing.ToListAsync();
            return Ok(walls);
        }

        [HttpGet("GetWall/{id}")]
        public async Task<IActionResult> GetWall(int id)
        {
            var wall = await _myDbContext.Climbing.FindAsync(id);
            if (wall == null)
            {
                return NotFound("Wall not found");
            }
            return Ok(wall);
        }

        [HttpPost("AddWall")]

        public async Task<IActionResult> AddWall ([FromBody] Climbing wallRequest)
        {
            await _myDbContext.AddAsync(wallRequest);
            await _myDbContext.SaveChangesAsync();
            return Ok(wallRequest);
        }

        [HttpDelete("DeleteWall/{id}")]

        public async Task<IActionResult> DeleteWall(int id)
        {
            var wall = await _myDbContext.Climbing.FindAsync(id);
            if (wall == null)
            {
                return NotFound("Wall not found");
            }

            _myDbContext.Climbing.Remove(wall);
            await _myDbContext.SaveChangesAsync();
            return Ok("Wall deleted successfully");
        }

        [HttpPut("UpdateWall/{id}")]

        public async Task<IActionResult> UpdateWall(int id, Climbing wallRequest)
        {

            var existingWall = await _myDbContext.Climbing.FindAsync(id);
            if (existingWall == null)
            {
                return NotFound();
            }

            existingWall.Wall = wallRequest.Wall;
            existingWall.Level = wallRequest.Level;

            try
            {
                _myDbContext.Climbing.Update(existingWall);
                await _myDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WallExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Wall updated successfully");
        }

        private bool WallExists(int id)
        {
            return _myDbContext.Climbing.Any(e => e.Climbing_id == id);
        }






        // FOR TRAINERS: 

        [HttpGet("GetAllTrainers")]

        public async Task<IActionResult> GetAllTrainers()
        {
            var trainers = await _myDbContext.Trainers.ToListAsync();
            return Ok(trainers);
        }

        [HttpGet("GetTrainer/{id}")]
        public async Task<IActionResult> GetTrainer(int id)
        {
            var trainer = await _myDbContext.Trainers.FindAsync(id);
            if (trainer == null)
            {
                return NotFound("Trainer not found");
            }
            return Ok(trainer);
        }

        [HttpPost("AddTrainer")]

        public async Task<IActionResult> AddTrainer([FromBody] Trainers trainerRequest)
        {
            await _myDbContext.AddAsync(trainerRequest);
            await _myDbContext.SaveChangesAsync();
            return Ok(trainerRequest);
        }

        [HttpDelete("DeleteTrainer/{id}")]

        public async Task<IActionResult> DeleteTrainer(int id)
        {
            var trainer = await _myDbContext.Trainers.FindAsync(id);
            if (trainer == null)
            {
                return NotFound("Trainer not found");
            }

            _myDbContext.Trainers.Remove(trainer);
            await _myDbContext.SaveChangesAsync();
            return Ok("Trainer deleted successfully");
        }

        [HttpPut("UpdateTrainer/{id}")]

        public async Task<IActionResult> UpdateTrainer(int id, Trainers trainerRequest)
        {

            var existingTrainer = await _myDbContext.Trainers.FindAsync(id);
            if (existingTrainer == null)
            {
                return NotFound();
            }

            existingTrainer.Type = trainerRequest.Type;
            existingTrainer.Trainer_name = trainerRequest.Trainer_name;

            try
            {
                _myDbContext.Trainers.Update(existingTrainer);
                await _myDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrainerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Trainer updated successfully");
        }

        private bool TrainerExists(int id)
        {
            return _myDbContext.Trainers.Any(e => e.Trainer_id == id);
        }






        // FOR EQUIPMENT: 

        [HttpGet("GetAllEquipments")]

        public async Task<IActionResult> GetAllEquipments()
        {
            var equipments = await _myDbContext.Equipment.ToListAsync();
            return Ok(equipments);
        }

        [HttpGet("GetEquipment/{id}")]
        public async Task<IActionResult> GetEquipment(int id)
        {
            var equipment = await _myDbContext.Equipment.FindAsync(id);
            if (equipment == null)
            {
                return NotFound("Equipment not found");
            }
            return Ok(equipment);
        }

        [HttpPost("AddEquipment")]

        public async Task<IActionResult> AddEquipment([FromBody] Equipment equipmentRequest)
        {
            await _myDbContext.AddAsync(equipmentRequest);
            await _myDbContext.SaveChangesAsync();
            return Ok(equipmentRequest);
        }

        [HttpDelete("DeleteEquipment/{id}")]

        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var equipment = await _myDbContext.Equipment.FindAsync(id);
            if (equipment == null)
            {
                return NotFound("Equipment not found");
            }

            _myDbContext.Equipment.Remove(equipment);
            await _myDbContext.SaveChangesAsync();
            return Ok("Equipment deleted successfully");
        }

        [HttpPut("UpdateEquipment/{id}")]

        public async Task<IActionResult> UpdateEquipment(int id, Equipment equipmentRequest)
        {

            var existingEquipment = await _myDbContext.Equipment.FindAsync(id);
            if (existingEquipment == null)
            {
                return NotFound();
            }

            existingEquipment.Equipment_name = equipmentRequest.Equipment_name;
            existingEquipment.Body = equipmentRequest.Body;

            try
            {
                _myDbContext.Equipment.Update(existingEquipment);
                await _myDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Equipment updated successfully");
        }

        private bool EquipmentExists(int id)
        {
            return _myDbContext.Equipment.Any(e => e.Equipment_id == id);
        }

        [HttpPost("Subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] Subscription subscription)
        {
            try
            {
                var user = await _myDbContext.Users.FindAsync(subscription.User_id);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var newSubscription = new Subscription
                {
                    Type = subscription.Type,
                    Time_sub = subscription.Time_sub,
                    User_id = subscription.User_id
                };

                await _myDbContext.Subscription.AddAsync(newSubscription);
                await _myDbContext.SaveChangesAsync();

                return Ok("Subscription added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("GetSwimmingTrainer")]
        public async Task<IActionResult> GetSwimmingTrainer()
        {
            var swimmingTrainer = await _myDbContext.Trainers.FirstOrDefaultAsync(t => t.Type == "Swimming");
            if (swimmingTrainer == null)
            {
                return NotFound("Swimming trainer not found");
            }
            return Ok(swimmingTrainer);
        }

        [HttpGet("GetGymTrainer")]
        public async Task<IActionResult> GetGymTrainer()
        {
            var gymTrainer = await _myDbContext.Trainers.FirstOrDefaultAsync(t => t.Type == "Gym");
            if (gymTrainer == null)
            {
                return NotFound("Gym trainer not found");
            }
            return Ok(gymTrainer);
        }

        [HttpGet("GetClimbingTrainer")]
        public async Task<IActionResult> GetClimbingTrainer()
        {
            var climbingTrainer = await _myDbContext.Trainers.FirstOrDefaultAsync(t => t.Type == "Climbing");
            if (climbingTrainer == null)
            {
                return NotFound("Climbing trainer not found");
            }
            return Ok(climbingTrainer);
        }

        [HttpGet("GetAllBookings")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _myDbContext.Booking.ToListAsync();
            return Ok(bookings);
        }


        [HttpPost("AddBooking")]
        public async Task<IActionResult> AddBooking([FromBody] Booking booking)
        {
            if (booking == null)
            {
                return BadRequest("Invalid booking data");
            }

            try
            {

                await _myDbContext.AddAsync(booking);
                await _myDbContext.SaveChangesAsync();

                return Ok("Booking added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding booking: {ex.Message}");
            }
        }

        [HttpGet("GetSubscriptionByTrainer/{type}")]
        public async Task<IActionResult> GetSubscriptionByTrainer(string type)
        {
            try
            {
                var subscriptions = await _myDbContext.Subscription
                    .Where(u => u.Type == type)
                    .Join(_myDbContext.Users,
                        subscription => subscription.User_id,
                        user => user.User_id,
                        (subscription, user) => new
                        {
                            subscription.Subscription_id,
                            subscription.Type,
                            subscription.User_id,
                            subscription.Time_sub,
                            user.User_name
                        })
                    .ToListAsync();

                if (subscriptions == null || !subscriptions.Any())
                {
                    return NotFound($"Subscriptions not found for type: {type}");
                }

                return Ok(subscriptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        [HttpGet("GetBookingByUser/{id}")]
        public async Task<IActionResult> GetBookingByUser(int id)
        {
            try
            {
                var booking = await _myDbContext.Booking
                    .Where(b => b.User_id == id)
                    .Join(_myDbContext.Users,
                        booking => booking.User_id,
                        user => user.User_id,
                        (booking, user) => new
                        {
                            booking.Booking_id,
                            booking.Day,
                            booking.Hour,
                            booking.User_id,
                            booking.Trainer_id,
                            user.User_name
                        })
                    .ToListAsync();

                if (booking == null || !booking.Any())
                {
                    return NotFound("Bookings not found");
                }

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetBookingByTrainer/{id}")]
        public async Task<IActionResult> GetBookingByTrainer(int id)
        {
            try
            {
                var booking = await _myDbContext.Booking
                    .Where(b => b.Trainer_id == id)
                    .Join(_myDbContext.Users,
                        booking => booking.User_id,
                        user => user.User_id,
                        (booking, user) => new
                        {
                            booking.Booking_id,
                            booking.Day,
                            booking.Hour,
                            booking.User_id,
                            booking.Trainer_id,
                            user.User_name
                        })
                    .ToListAsync();

                if (booking == null || !booking.Any())
                {
                    return NotFound("Bookings not found");
                }

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
