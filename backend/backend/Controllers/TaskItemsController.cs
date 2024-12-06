using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Repositories.TaskRepo;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Net.Mail;
using System.Net;
using backend.Repositories.UserRepo;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemsController : ControllerBase
    {
        private readonly ITaskRepo _taskRepo;
        private readonly IUserRepo _userRepo;
        private readonly IConfiguration _config;

        public TaskItemsController(ITaskRepo taskRepo, IUserRepo userRepo, IConfiguration config)
        {
            _taskRepo = taskRepo;
            _userRepo = userRepo;
            _config = config;
        }

        // GET: api/TaskItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItemVM>>> GetTaskItems()
        {
            var tasks = await _taskRepo.GetAllTasksAsync();
            return Ok(tasks);
        }

        // GET: api/TaskItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemVM>> GetTaskItem(int id)
        {
            var taskItem = await _taskRepo.GetTaskByIdAsync(id);

            if (taskItem == null)
            {
                return NotFound();
            }

            return taskItem;
        }

        // PUT: api/TaskItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskItem(int id, TaskItem taskItem)
        {
            if (id != taskItem.Id)
            {
                return BadRequest();
            }

            try
            {
                var updatedTask = await _taskRepo.UpdateTaskAsync(taskItem);
                // Gửi email thông báo cho người phụ trách
                var user = await _userRepo.GetUserByIdAsync(taskItem.InchargeId.Value);
                if (user != null)
                {
                    await SendTaskEmail(user, "Thông báo: Có một task vừa được cập nhật cho bạn!", $"A updated task has been assigned to you: {taskItem.Title}");
                }

                return Ok(updatedTask); 
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await TaskItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/TaskItems
        [HttpPost]
        public async Task<ActionResult<TaskItem>> PostTaskItem(TaskItem taskItem)
        {
            await _taskRepo.CreateTaskAsync(taskItem);

            // Gửi email thông báo cho người phụ trách
            var user = await _userRepo.GetUserByIdAsync(taskItem.InchargeId.Value);
            if (user != null)
            {
                await SendTaskEmail(user, "Thông báo: Có một task mới vừa được tạo giao cho bạn!", $"A new task has been assigned to you: {taskItem.Title}");
            }

            return CreatedAtAction("GetTaskItem", new { id = taskItem.Id }, taskItem);
        }

        // DELETE: api/TaskItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskItem(int id)
        {
            var taskItem = await _taskRepo.GetTaskByIdAsync(id);
            if (taskItem == null)
            {
                return NotFound();
            }

            await _taskRepo.DeleteTaskByIdAsync(taskItem.Id);
            // Gửi email thông báo cho người phụ trách
            var user = await _userRepo.GetUserByIdAsync(taskItem.InchargeId.Value);
            if (user != null)
            {
                await SendTaskEmail(user, "Thông báo: Có một task bạn đang phụ trách bị xóa!", $"A task has been deleted: {taskItem.Title}");
            }
            return NoContent();
        }

        private async Task<bool> TaskItemExists(int id)
        {
            var task = await _taskRepo.GetTaskByIdAsync(id);
            return task != null;
        }

        private async Task SendTaskEmail(User user, string subject, string content)
        {
            var smtpClient = new SmtpClient(_config["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(_config["EmailSettings:SmtpPort"]),
                Credentials = new NetworkCredential(_config["EmailSettings:SenderEmail"], _config["EmailSettings:SenderPassword"]),
                EnableSsl = true,
            };

            var emailContent = content;
            await smtpClient.SendMailAsync(_config["EmailSettings:SenderEmail"], user.Email, subject, emailContent);
        }
    }
}
