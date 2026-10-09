import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

public class ResourceSharingPlatform {
    static Scanner sc = new Scanner(System.in);
    static HashMap<String, User> users = new HashMap<>();
    static ArrayList<ResourcePost> posts = new ArrayList<>();
    static ArrayList<CommunityRaid> raids = new ArrayList<>();
    static String currentUser = null;
    static int nextPostId = 1;

    // ANSI Colors
    static final String RESET = "\u001B[0m";
    static final String CYAN = "\u001B[36m";
    static final String GREEN = "\u001B[32m";
    static final String RED = "\u001B[31m";
    static final String YELLOW = "\u001B[33m";
    static final String PURPLE = "\u001B[35m";
    static final String BOLD = "\u001B[1m";

    static final String[] CATEGORIES = { "Tools", "Books", "Outdoors", "Clothes", "Electronics", "Other" };
    static final String DATA_FILE_USERS = "users.dat";
    static final String DATA_FILE_POSTS = "posts.dat";
    static final String DATA_FILE_RAIDS = "raids.dat";

    public static void main(String[] args) {
        loadData();
        Runtime.getRuntime().addShutdownHook(new Thread(ResourceSharingPlatform::saveData));

        System.out.println(BOLD + CYAN + "\n=============================================================");
        System.out.println("   SHAREFLOW AI 2.0: GAMIFIED AUTONOMOUS RESOURCE SHARING");
        System.out.println("=============================================================" + RESET);

        boolean running = true;
        while (running) {
            if (currentUser == null) {
                System.out.println("\n[1] " + GREEN + "Log in" + RESET);
                System.out.println("[2] " + CYAN + "Register" + RESET);
                System.out.println("[3] " + RED + "Exit" + RESET);
                System.out.print("Choose: ");
                String opt = sc.nextLine().trim();
                switch (opt) {
                    case "1":
                        login();
                        break;
                    case "2":
                        register();
                        break;
                    case "3":
                        running = false;
                        break;
                    default:
                        System.out.println(RED + "Invalid option." + RESET);
                }
            } else {
                homeMenu();
            }
        }
        saveData();
    }

    @SuppressWarnings("unchecked")
    static void loadData() {
        try (ObjectInputStream userIn = new ObjectInputStream(new FileInputStream(DATA_FILE_USERS))) {
            users = (HashMap<String, User>) userIn.readObject();
        } catch (Exception e) {
            seedDefaultUsers();
        }

        try (ObjectInputStream postIn = new ObjectInputStream(new FileInputStream(DATA_FILE_POSTS))) {
            posts = (ArrayList<ResourcePost>) postIn.readObject();
            nextPostId = posts.stream().mapToInt(ResourcePost::getId).max().orElse(0) + 1;
        } catch (Exception e) {
            seedDefaultPosts();
        }

        try (ObjectInputStream raidIn = new ObjectInputStream(new FileInputStream(DATA_FILE_RAIDS))) {
            raids = (ArrayList<CommunityRaid>) raidIn.readObject();
        } catch (Exception e) {
            seedDefaultRaids();
        }
    }

    static void seedDefaultUsers() {
        users.clear();
        User admin = new User("admin", "admin", "Seattle Eastside", true);
        admin.addKarma(900); // Promotes to Guardian
        users.put("admin", admin);

        User alice = new User("alice", "1234", "Downtown", false);
        alice.addKarma(350); // Pillar
        users.put("alice", alice);

        User bob = new User("bob", "1234", "Capitol Hill", false);
        users.put("bob", bob);
    }

    static void seedDefaultPosts() {
        posts.clear();
        posts.add(new ResourcePost(1, "bob", "Tools", "Capitol Hill", 0.3,
                "DeWalt Cordless Drill Kit (18V)", "offer",
                "Complete 18V brushless motor cordless drill with 2 batteries and bit set.", "Like New", 14));
        posts.add(new ResourcePost(2, "admin", "Books", "Seattle Eastside", 0.8,
                "General Chemistry & Calculus 10th Ed.", "offer",
                "Hardbound university edition for Chem 101/102 and calculus.", "Like New", 14));
        posts.add(new ResourcePost(3, "alice", "Outdoors", "Downtown", 1.2,
                "Ultralight 2-Person Dome Camping Tent", "offer",
                "Weatherproof ripstop nylon dome tent with lightweight aluminum poles.", "Brand New", 14));
        posts.add(new ResourcePost(4, "alice", "Tools", "Downtown", 1.5,
                "Need wood repair for study table", "request",
                "Looking to borrow a power drill or sander for a loose table frame.", "Request", 7));
        nextPostId = 5;
    }

    static void seedDefaultRaids() {
        raids.clear();
        raids.add(new CommunityRaid("raid-1", "Midterm Campus Textbook Exchange", "Books", 50, 42,
                "4 Days remaining", "Campus Coffee Voucher & +2.0x Karma Multiplier"));
        raids.add(new CommunityRaid("raid-2", "Winter Warmth Outerwear Drive", "Clothes", 50, 31,
                "11 Days remaining", "Zero-Waste Pioneer Profile Badge"));
        raids.add(new CommunityRaid("raid-3", "Neighborhood Tool Library Collective", "Tools", 50, 46,
                "2 Days remaining", "Free Community Woodworking Workshop Access"));
    }

    static void saveData() {
        try (ObjectOutputStream userOut = new ObjectOutputStream(new FileOutputStream(DATA_FILE_USERS))) {
            userOut.writeObject(users);
        } catch (IOException ignored) {}

        try (ObjectOutputStream postOut = new ObjectOutputStream(new FileOutputStream(DATA_FILE_POSTS))) {
            postOut.writeObject(posts);
        } catch (IOException ignored) {}

        try (ObjectOutputStream raidOut = new ObjectOutputStream(new FileOutputStream(DATA_FILE_RAIDS))) {
            raidOut.writeObject(raids);
        } catch (IOException ignored) {}
    }

    static void homeMenu() {
        User u = users.get(currentUser);
        System.out.println(BOLD + "\n=================== DASHBOARD ===================" + RESET);
        System.out.printf("User: %s%s%s | Tier: %s%s%s (%.1fx multiplier)\n",
                CYAN, currentUser, RESET, PURPLE, u.getTier(), RESET, u.getKarmaMultiplier());
        System.out.printf("Karma: %s%d%s credits | Escrow: %s%d%s locked | Streak: %s🔥 %d Days%s\n",
                YELLOW, u.getKarmaCredits(), RESET, CYAN, u.getEscrowLocked(), RESET, YELLOW, u.getStreakDays(), RESET);
        System.out.printf("Impact: %s%.1f kg CO2%s diverted | $%s%.0f%s saved | Rating: %.1f ⭐\n",
                GREEN, u.getCo2SavedKg(), RESET, GREEN, u.getDollarsSaved(), RESET, u.getReputation());
        System.out.println("-------------------------------------------------");

        // Check autonomous matches
        List<SemanticMatchmaker.TradeMatch> matches = SemanticMatchmaker.findAgenticMatches(posts);
        if (!matches.isEmpty()) {
            System.out.printf("%s🤖 AGENTIC MATCH ALERT: %d autonomous trade proposal(s) available!%s\n",
                    GREEN + BOLD, matches.size(), RESET);
        }

        System.out.println("1. " + GREEN + "Post Resource (Offer)" + RESET);
        System.out.println("2. " + YELLOW + "Request Resource" + RESET);
        System.out.println("3. Browse Inventory & Proximity Radar");
        System.out.println("4. AI Semantic Search (SBERT)");
        System.out.println("5. Agentic Matchmaker Queue 🤖");
        System.out.println("6. Community Raids & Seasonal Quests 🏆");
        System.out.println("7. My Active Activity & Escrow Releases");
        System.out.println("8. Leaderboards & Badges");
        System.out.println("9. " + RED + "Log Out" + RESET);

        System.out.print("Action: ");
        String opt = sc.nextLine().trim();
        switch (opt) {
            case "1": createPost("offer"); break;
            case "2": createPost("request"); break;
            case "3": browsePosts(); break;
            case "4": searchMenu(); break;
            case "5": agenticMatchmakerMenu(matches); break;
            case "6": communityRaidsMenu(); break;
            case "7": myActivityMenu(); break;
            case "8": showLeaderboard(); break;
            case "9": currentUser = null; break;
            default: System.out.println("Invalid.");
        }
    }

    static void login() {
        System.out.print("Username: ");
        String un = sc.nextLine().trim();
        if (!users.containsKey(un)) {
            System.out.println(RED + "User not found." + RESET);
            return;
        }
        System.out.print("Password: ");
        String pw = sc.nextLine().trim();
        if (users.get(un).getPassword().equals(pw)) {
            currentUser = un;
            System.out.println(GREEN + "Welcome back, " + un + "!" + RESET);
        } else {
            System.out.println(RED + "Wrong password." + RESET);
        }
    }

    static void register() {
        System.out.print("New Username: ");
        String un = sc.nextLine().trim();
        if (users.containsKey(un)) {
            System.out.println(RED + "Taken." + RESET);
            return;
        }
        System.out.print("Password: ");
        String pw = sc.nextLine().trim();
        System.out.print("Neighborhood/City: ");
        String loc = sc.nextLine().trim();
        users.put(un, new User(un, pw, loc, false));
        System.out.println(GREEN + "Registered! You've received 500 initial Karma Credits." + RESET);
        saveData();
    }

    static void createPost(String type) {
        System.out.println("\n--- New " + (type.equals("offer") ? "Offer" : "Request") + " ---");
        for (int i = 0; i < CATEGORIES.length; i++)
            System.out.printf("[%d] %s  ", i + 1, CATEGORIES[i]);
        System.out.print("\nCategory: ");
        int catIdx = -1;
        try {
            catIdx = Integer.parseInt(sc.nextLine().trim()) - 1;
        } catch (Exception ignored) {}

        String cat = (catIdx >= 0 && catIdx < CATEGORIES.length) ? CATEGORIES[catIdx] : "Other";
        System.out.print("Item Name: ");
        String item = sc.nextLine().trim();
        System.out.print("Condition (Brand New / Like New / Fair): ");
        String cond = sc.nextLine().trim();
        if (cond.isEmpty()) cond = "Like New";
        System.out.print("Description: ");
        String desc = sc.nextLine().trim();
        System.out.print("Distance in miles (e.g. 0.5): ");
        double dist = 0.5;
        try {
            dist = Double.parseDouble(sc.nextLine().trim());
        } catch (Exception ignored) {}

        String loc = users.get(currentUser).getLocation();
        ResourcePost newPost = new ResourcePost(nextPostId++, currentUser, cat, loc, dist, item, type, desc, cond, 14);
        posts.add(newPost);

        if (type.equals("offer")) {
            users.get(currentUser).addKarma(50);
            System.out.println(GREEN + "Posted! Earned +50 Karma Credits for listing inventory." + RESET);
        } else {
            System.out.println(GREEN + "Request Broadcasted across Neighborhood Radar." + RESET);
        }
        saveData();
    }

    static void browsePosts() {
        System.out.println("\n--- COMMUNITY RADAR INVENTORY ---");
        List<ResourcePost> active = posts.stream()
                .filter(p -> !p.isExpired() && (p.getStatus().equals("available") || p.getStatus().equals("in_escrow")))
                .collect(Collectors.toList());

        if (active.isEmpty()) {
            System.out.println("No active listings.");
            return;
        }

        for (ResourcePost p : active) {
            System.out.println(p);
            System.out.println("---------------------------------------------");
        }

        System.out.println("[1] Interact with Post (Claim/Escrow/Comment)  [2] Back");
        if (sc.nextLine().trim().equals("1")) {
            interactWithPost(active);
        }
    }

    static void interactWithPost(List<ResourcePost> active) {
        System.out.print("Enter Post ID: ");
        int pid = -1;
        try { pid = Integer.parseInt(sc.nextLine().trim()); } catch (Exception ignored) {}

        final int targetId = pid;
        ResourcePost p = active.stream().filter(post -> post.getId() == targetId).findFirst().orElse(null);
        if (p == null) {
            System.out.println(RED + "Not found." + RESET);
            return;
        }

        System.out.println("Selected: " + p.getItem() + " (" + p.getStatus() + ")");
        System.out.println("[1] Add Comment\n[2] Rate Owner (" + p.getOwner() + ")\n[3] Lock in Escrow & Borrow\n[4] Complete Return & Release Escrow");
        String choice = sc.nextLine().trim();

        if (choice.equals("1")) {
            System.out.print("Comment: ");
            String c = sc.nextLine().trim();
            p.addComment(currentUser, c);
            System.out.println(GREEN + "Comment posted." + RESET);
        } else if (choice.equals("2")) {
            if (p.getOwner().equals(currentUser)) {
                System.out.println(RED + "Cannot rate yourself." + RESET);
                return;
            }
            System.out.print("Stars (1-5): ");
            try {
                int stars = Integer.parseInt(sc.nextLine().trim());
                User owner = users.get(p.getOwner());
                if (owner != null) {
                    owner.rateUser(stars);
                    System.out.println(GREEN + "Rated " + p.getOwner() + " " + stars + " stars!" + RESET);
                }
            } catch (Exception ignored) {}
        } else if (choice.equals("3")) {
            if (p.getOwner().equals(currentUser)) {
                System.out.println(RED + "Cannot borrow your own item." + RESET);
                return;
            }
            User u = users.get(currentUser);
            if (u.lockEscrow(p.getEscrowDeposit())) {
                p.setStatus("in_escrow");
                System.out.println(GREEN + "SUCCESS: Locked " + p.getEscrowDeposit() + " Karma in escrow. Handover QR active!" + RESET);
            } else {
                System.out.println(RED + "Insufficient Karma credits. Please lend items to mint more." + RESET);
            }
        } else if (choice.equals("4")) {
            User u = users.get(currentUser);
            u.releaseEscrow(p.getEscrowDeposit(), true);
            p.setStatus("available");
            System.out.println(GREEN + "🎉 ITEM RETURNED! Escrow released + 1.5x Multiplier awarded. Zero-waste streak extended!" + RESET);
        }
        saveData();
    }

    static void searchMenu() {
        System.out.print("Enter Concept / Keyword (e.g. 'wood repair', 'calculus'): ");
        String kw = sc.nextLine().trim();
        System.out.println("\n--- SBERT SEMANTIC MATCH RESULTS ---");
        boolean found = false;

        for (ResourcePost p : posts) {
            double sim = SemanticMatchmaker.computeSimilarity(kw, p);
            if (sim >= 0.35 && !p.isExpired()) {
                found = true;
                System.out.printf("%s[%.0f%% Match]%s %s (ID: %d, Distance: %.1f mi)\n  Desc: %s\n",
                        PURPLE, sim * 100.0, RESET, p.getItem(), p.getId(), p.getDistanceMiles(), p.getDescription());
            }
        }
        if (!found) System.out.println("No matching resources in semantic vector space.");
    }

    static void agenticMatchmakerMenu(List<SemanticMatchmaker.TradeMatch> matches) {
        System.out.println(BOLD + "\n--- AUTONOMOUS AGENTIC MATCHMAKER QUEUE ---" + RESET);
        if (matches.isEmpty()) {
            System.out.println("All requests are currently fulfilled or unmatched.");
            return;
        }

        for (int i = 0; i < matches.size(); i++) {
            System.out.printf("[%d] %s\n---------------------------------------------\n", i + 1, matches.get(i));
        }

        System.out.print("Select match to auto-propose trade (or Enter to back): ");
        String s = sc.nextLine().trim();
        try {
            int idx = Integer.parseInt(s) - 1;
            if (idx >= 0 && idx < matches.size()) {
                SemanticMatchmaker.TradeMatch tm = matches.get(idx);
                tm.getRequestPost().setStatus("in_escrow");
                tm.getOfferPost().setStatus("in_escrow");
                System.out.println(GREEN + "Trade proposal sent! Both items placed in verified escrow." + RESET);
                saveData();
            }
        } catch (Exception ignored) {}
    }

    static void communityRaidsMenu() {
        System.out.println(BOLD + "\n--- ACTIVE COMMUNITY RAIDS & SEASONAL QUESTS ---" + RESET);
        for (int i = 0; i < raids.size(); i++) {
            System.out.printf("[%d] %s\n\n", i + 1, raids.get(i));
        }

        System.out.print("Contribute item to raid # (or Enter to back): ");
        String s = sc.nextLine().trim();
        try {
            int idx = Integer.parseInt(s) - 1;
            if (idx >= 0 && idx < raids.size()) {
                CommunityRaid r = raids.get(idx);
                if (r.contribute()) {
                    users.get(currentUser).addKarma(100);
                    System.out.println(GREEN + "Contributed to " + r.getTitle() + "! Earned +100 Karma Credits & Multiplier boost." + RESET);
                    saveData();
                }
            }
        } catch (Exception ignored) {}
    }

    static void myActivityMenu() {
        System.out.println(BOLD + "\n--- MY ACTIVITY & ACTIVE CONTRACTS ---" + RESET);
        for (ResourcePost p : posts) {
            if (p.getOwner().equals(currentUser)) {
                System.out.println(p);
                System.out.println("---------------------------------------------");
            }
        }
    }

    static void showLeaderboard() {
        System.out.println(BOLD + "\n--- TOP CONTRIBUTORS (KARMA ECONOMY) ---" + RESET);
        users.values().stream()
                .sorted((u1, u2) -> Integer.compare(u2.getKarmaCredits(), u1.getKarmaCredits()))
                .limit(5)
                .forEach(u -> System.out.printf("⭐ %s (%s) : %d Karma | %d Streak Days | %.1f kg CO2 diverted\n",
                        u.getUsername(), u.getTier(), u.getKarmaCredits(), u.getStreakDays(), u.getCo2SavedKg()));
    }
}
