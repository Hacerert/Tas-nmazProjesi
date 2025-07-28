using tasinmazBackend.Entitiy;

namespace tasinmazBackend.Services.Interfaces
{
    public interface IUserService
    {
        User ValidateUser(string email, string password);
    }
}
