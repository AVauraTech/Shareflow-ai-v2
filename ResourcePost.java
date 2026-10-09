import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ResourcePost implements Serializable {
    private static final long serialVersionUID = 3L; // Version bumped for 2.0
    private int id;
    private String owner;
    private String category;
    private String location;
    private double distanceMiles;
    private String item;
    private String type; // "offer" or "request"
    private String description;
    private String condition;
    private double co2Diverted;
    private int escrowDeposit;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String status; // available, in_escrow, claimed, expired
    private Set<String> flags;
    private List<String> comments;
    private List<String> semanticTokens;

    public ResourcePost(int id, String owner, String category, String location, double distanceMiles,
                        String item, String type, String description, String condition, int daysValid) {
        this.id = id;
        this.owner = owner;
        this.category = category;
        this.location = location;
        this.distanceMiles = distanceMiles;
        this.item = item;
        this.type = type;
        this.description = description;
        this.condition = condition;
        this.co2Diverted = category.equalsIgnoreCase("Tools") ? 8.5 : 4.2;
        this.escrowDeposit = 50;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = this.createdAt.plusDays(daysValid);
        this.status = "available";
        this.flags = new HashSet<>();
        this.comments = new ArrayList<>();
        this.semanticTokens = new ArrayList<>();
        extractSemanticTokens();
    }

    private void extractSemanticTokens() {
        String combined = (item + " " + description + " " + category).toLowerCase();
        String[] words = combined.split("\\W+");
        for (String w : words) {
            if (w.length() > 2 && !semanticTokens.contains(w)) {
                semanticTokens.add(w);
            }
        }
    }

    // Getters and Setters
    public int getId() { return id; }
    public String getOwner() { return owner; }
    public String getCategory() { return category; }
    public String getLocation() { return location; }
    public double getDistanceMiles() { return distanceMiles; }
    public String getItem() { return item; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getCondition() { return condition; }
    public double getCo2Diverted() { return co2Diverted; }
    public int getEscrowDeposit() { return escrowDeposit; }
    public String getStatus() { return status; }
    public int getFlagCount() { return flags.size(); }
    public boolean isExpired() { return LocalDateTime.now().isAfter(expiresAt); }
    public List<String> getComments() { return comments; }
    public List<String> getSemanticTokens() { return semanticTokens; }

    public void setItem(String item) { this.item = item; }
    public void setDescription(String desc) { this.description = desc; }
    public void setCategory(String cat) { this.category = cat; }
    public void setLocation(String loc) { this.location = loc; }
    public void setStatus(String status) { this.status = status; }

    public void addFlag(String user) { flags.add(user); }
    public void clearFlags() { flags.clear(); }
    public void addComment(String username, String text) {
        this.comments.add(username + ": " + text);
    }

    @Override
    public String toString() {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String color = type.equalsIgnoreCase("offer") ? "\u001B[32m" : "\u001B[33m";
        String cyan = "\u001B[36m";
        String reset = "\u001B[0m";

        StringBuilder sb = new StringBuilder();
        sb.append(String.format(
                "%s[%s] %s%s (ID: %d)\n" +
                "  Cat: %s | Condition: %s | Distance: %s%.1f mi%s\n" +
                "  Owner: %s | Loc: %s | Expires: %s\n" +
                "  Desc: %s\n" +
                "  Status: %s | CO2 Offset: %.1f kg | Escrow: %d Karma",
                color, type.toUpperCase(), item, reset, id,
                category, condition, cyan, distanceMiles, reset,
                owner, location, expiresAt.format(fmt),
                description, status, co2Diverted, escrowDeposit));

        if (!comments.isEmpty()) {
            sb.append("\n  Comments (" + comments.size() + "):");
            int start = Math.max(0, comments.size() - 2);
            for (int i = start; i < comments.size(); i++) {
                sb.append("\n   - " + comments.get(i));
            }
        }
        return sb.toString();
    }
}
