import java.io.Serializable;

public class CommunityRaid implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String title;
    private String category;
    private int targetCount;
    private int currentCount;
    private String deadline;
    private String rewardDescription;

    public CommunityRaid(String id, String title, String category, int targetCount, int currentCount, String deadline, String rewardDescription) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.targetCount = targetCount;
        this.currentCount = currentCount;
        this.deadline = deadline;
        this.rewardDescription = rewardDescription;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public int getTargetCount() { return targetCount; }
    public int getCurrentCount() { return currentCount; }
    public String getDeadline() { return deadline; }
    public String getRewardDescription() { return rewardDescription; }

    public double getProgressPercentage() {
        return Math.min(100.0, (double) currentCount / targetCount * 100.0);
    }

    public boolean contribute() {
        if (currentCount < targetCount) {
            currentCount++;
            return true;
        }
        return false;
    }

    @Override
    public String toString() {
        int pct = (int) Math.round(getProgressPercentage());
        StringBuilder bar = new StringBuilder("[");
        int filled = pct / 5; // 20 segments
        for (int i = 0; i < 20; i++) {
            if (i < filled) bar.append("█");
            else bar.append("░");
        }
        bar.append("]");

        return String.format("%s (%s)\n  Progress: %s %d%% (%d/%d shared)\n  Reward: %s | %s",
                title, category, bar.toString(), pct, currentCount, targetCount, rewardDescription, deadline);
    }
}
