using backend.Entities;
using backend.Repositories.TaskRepo;
using backend.Repositories.UserRepo;
using System.Net.Mail;
using System.Net;

namespace backend.Services
{
    public class TaskReminderService : IHostedService, IDisposable
    {
        private readonly ITaskRepo _taskRepo;
        private readonly IUserRepo _userRepo;
        private readonly IConfiguration _config;
        private readonly ILogger<TaskReminderService> _logger;
        private Timer _timer;

        public TaskReminderService(ITaskRepo taskRepo, IUserRepo userRepo, IConfiguration config, ILogger<TaskReminderService> logger)
        {
            _taskRepo = taskRepo;
            _userRepo = userRepo;
            _config = config;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // Set the timer to run every day
            _timer = new Timer(SendReminderEmails, null, TimeSpan.Zero, TimeSpan.FromDays(1));
            return Task.CompletedTask;
        }

        private async void SendReminderEmails(object state)
        {
            var tasks = await _taskRepo.GetAllTasksAsync();
            var tomorrow = DateOnly.FromDateTime(DateTime.Now.AddDays(1));

            var tasksDueTomorrow = tasks.Where(t => t.DueDate == tomorrow && !t.IsCompleted).ToList();

            foreach (var task in tasksDueTomorrow)
            {
                var user = await _userRepo.GetUserByIdAsync(task.InchargeId.Value);
                if (user != null)
                {
                    await SendTaskEmail(user, "Reminder: Task Due Tomorrow", $"Your task '{task.Title}' is due tomorrow. Please make sure to complete it.");
                }
            }
        }

        private async Task SendTaskEmail(User user, string subject, string content)
        {
            var smtpClient = new SmtpClient(_config["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(_config["EmailSettings:SmtpPort"]),
                Credentials = new NetworkCredential(_config["EmailSettings:SenderEmail"], _config["EmailSettings:SenderPassword"]),
                EnableSsl = true,
            };

            await smtpClient.SendMailAsync(_config["EmailSettings:SenderEmail"], user.Email, subject, content);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
