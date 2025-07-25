using tasinmazBackend.Entitiy;
using tasinmazBackend.Models;

namespace tasinmazBackend.Services.Interfaces
{
    public interface IUserService
    {
        User ValidateUser(string email, string password);
    }
}
