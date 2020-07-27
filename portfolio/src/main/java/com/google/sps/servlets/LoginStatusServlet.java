import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/login")
public class LoginStatusServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html;");
    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      String email = userService.getCurrentUser().getEmail();
      String link = userService.createLogoutURL("/");
      response.getWriter().println(new Gson().toJson(new User(true, link, email)));
    } else {
      String link = userService.createLoginURL("/");
      response.getWriter().println(new Gson().toJson(new User(false, link)));
    }
  }

  static class User {
    boolean loggedIn;
    String email;
    String link;

    public User(boolean loggedIn, String link) {
      this.loggedIn = loggedIn;
      this.link = link;
    }

    public User(boolean loggedIn, String link, String email) {
      this(loggedIn, link);
      this.email = email;
    }
  }
}
