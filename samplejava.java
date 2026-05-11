java 



import java.sql.*;
import java.io.*;
import java.util.*;

public class InsecureUserLogin {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/appdb";
    private static final String USER = "root";
    private static final String PASSWORD = "root123";

    public static void main(String[] args) throws Exception {

        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter username: ");
        String username = scanner.nextLine();

        System.out.print("Enter password: ");
        String password = scanner.nextLine();

        Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);

        // SQL Injection Vulnerability
        String query = "SELECT * FROM users WHERE username='" + username +
                "' AND password='" + password + "'";

        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        if (rs.next()) {
            System.out.println("Login successful");

            // Command Injection Vulnerability
            Runtime.getRuntime().exec("ping " + username);

            // Arbitrary File Read Vulnerability
            File file = new File("/tmp/" + username);
            BufferedReader br = new BufferedReader(new FileReader(file));
            System.out.println(br.readLine());
            br.close();

        } else {
            System.out.println("Invalid credentials");
        }

        rs.close();
        stmt.close();
        conn.close();
    }
}