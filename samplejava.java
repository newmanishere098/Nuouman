import java.sql.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.Pattern;

public class SecureUserLogin {

    private static final String DB_URL = System.getenv("APP_DB_URL");
    private static final String USER = System.getenv("APP_DB_USER");
    private static final String PASSWORD = System.getenv("APP_DB_PASSWORD");

    private static final Pattern VALID_USERNAME =
            Pattern.compile("^[a-zA-Z0-9_]{3,20}$");

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter username: ");
        String username = scanner.nextLine();

        System.out.print("Enter password: ");
        String password = scanner.nextLine();

        if (!VALID_USERNAME.matcher(username).matches()) {
            System.out.println("Invalid username format");
            return;
        }

        try (
                Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(
                        "SELECT id FROM users WHERE username = ? AND password = ?"
                )
        ) {

            stmt.setString(1, username);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                System.out.println("Login successful");

                // Safe fixed command execution
                ProcessBuilder pb = new ProcessBuilder("ping", "127.0.0.1");
                pb.start();

                // Safe file access using normalized paths
                Path basePath = Paths.get("/tmp/appdata").toAbsolutePath().normalize();
                Path userFile = basePath.resolve(username + ".txt").normalize();

                if (!userFile.startsWith(basePath)) {
                    throw new SecurityException("Path traversal attempt detected");
                }

                if (Files.exists(userFile)) {
                    List<String> lines = Files.readAllLines(userFile);
                    if (!lines.isEmpty()) {
}