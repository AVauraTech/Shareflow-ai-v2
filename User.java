import java.io.Serializable;
import java.util.*;

public class User implements Serializable {
    private static final long serialVersionUID = 3L; // Version bumped for 2.0
    private String username;
    private String password;
    private String location;
    private double reputation; // Calculated average
    private double ratingSum;  // Sum of all stars
    private int totalRatings;  // Count of ratings

    // 2.0 Gamified Karma & Sustainability Economy
    private int karmaCredits;
    private double karmaMultiplier;
    private int escrowLocked;
    private int streakDays;
    private double co2SavedKg;
    private double dollarsSaved;
    private String tier;
    private List<String> badges;

    private Set<String> blockedUsers;
    private List<String> wishlist;
    private List<String> messages;
    private boolean isModerator;

    public User(String username, String password, String location, boolean isModerator) {
        this.username = username;
        this.password = password;
        this.location = location;
        this.reputation = 5.0;
        this.ratingSum = 5.0;
        this.totalRatings = 1;
        this.karmaCredits = 500;
        this.karmaMultiplier = 1.5;
        this.escrowLocked = 0;
        this.streakDays = 3;
        this.co2SavedKg = 15.0;
        this.dollarsSaved = 120.0;
        this.tier = "Resource Helper";
        this.badges = new ArrayList<>(Arrays.asList("Instant Responder"));
        this.blockedUsers = new HashSet<>();
        this.wishlist = new ArrayList<>();
        this.messages = new ArrayList<>();
        this.isModerator = isModerator;
        updateTier();
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getLocation() { return location; }
    public double getReputation() { return reputation; }
    public int getTotalRatings() { return totalRatings; }
    public boolean isModerator() { return isModerator; }
    public Set<String> getBlockedUsers() { return blockedUsers; }
    public List<String> getWishlist() { return wishlist; }
    public List<String> getMessages() { return messages; }
    public int getKarmaCredits() { return karmaCredits; }
    public double getKarmaMultiplier() { return karmaMultiplier; }
    public int getEscrowLocked() { return escrowLocked; }
    public int getStreakDays() { return streakDays; }
    public double getCo2SavedKg() { return co2SavedKg; }
    public double getDollarsSaved() { return dollarsSaved; }
    public String getTier() { return tier; }
    public List<String> getBadges() { return badges; }

    public void addMessage(String msg) {
        this.messages.add(msg);
    }

    public void addKarma(int amount) {
        int earned = (int) Math.round(amount * karmaMultiplier);
        this.karmaCredits += earned;
        updateTier();
    }

    public boolean lockEscrow(int amount) {
        if (this.karmaCredits >= amount) {
            this.karmaCredits -= amount;
            this.escrowLocked += amount;
            return true;
        }
        return false;
    }

    public void releaseEscrow(int amount, boolean returnedOnTime) {
        this.escrowLocked = Math.max(0, this.escrowLocked - amount);
        this.karmaCredits += amount;
        if (returnedOnTime) {
            int bonus = (int) Math.round(amount * 0.5 * karmaMultiplier);
            this.karmaCredits += bonus;
            this.streakDays++;
            this.co2SavedKg += 4.5;
            this.dollarsSaved += 40.0;
        }
        updateTier();
    }

    public void updateTier() {
        if (this.karmaCredits >= 1200) {
            this.tier = "Neighborhood Guardian";
            this.karmaMultiplier = 3.2;
            if (!badges.contains("Neighborhood Guardian")) badges.add("Neighborhood Guardian");
        } else if (this.karmaCredits >= 800) {
            this.tier = "Community Pillar";
            this.karmaMultiplier = 2.2;
        } else if (this.karmaCredits >= 400) {
            this.tier = "Resource Helper";
            this.karmaMultiplier = 1.5;
        } else {
            this.tier = "Newcomer";
            this.karmaMultiplier = 1.0;
        }
    }

    public void rateUser(int stars) {
        if (stars < 1) stars = 1;
        if (stars > 5) stars = 5;
        this.totalRatings++;
        this.ratingSum += stars;
        this.reputation = this.ratingSum / this.totalRatings;
    }
}
