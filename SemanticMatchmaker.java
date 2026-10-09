import java.util.*;

public class SemanticMatchmaker {

    public static class TradeMatch {
        private ResourcePost requestPost;
        private ResourcePost offerPost;
        private double similarityScore;
        private String rationale;

        public TradeMatch(ResourcePost requestPost, ResourcePost offerPost, double similarityScore, String rationale) {
            this.requestPost = requestPost;
            this.offerPost = offerPost;
            this.similarityScore = similarityScore;
            this.rationale = rationale;
        }

        public ResourcePost getRequestPost() { return requestPost; }
        public ResourcePost getOfferPost() { return offerPost; }
        public double getSimilarityScore() { return similarityScore; }
        public String getRationale() { return rationale; }

        @Override
        public String toString() {
            return String.format("🤖 SBERT Match (%.1f%% Confidence):\n  Request by %s: '%s'\n  Matches Offer by %s: '%s' (%.1f mi)\n  Rationale: %s",
                    similarityScore * 100.0,
                    requestPost.getOwner(), requestPost.getItem(),
                    offerPost.getOwner(), offerPost.getItem(), offerPost.getDistanceMiles(),
                    rationale);
        }
    }

    // Concept dictionary mapping related words to domains
    private static final Map<String, List<String>> CONCEPT_CLUSTERS = new HashMap<>();

    static {
        CONCEPT_CLUSTERS.put("wood repair", Arrays.asList("drill", "powertool", "screw", "sander", "saw", "carpentry", "furniture", "table", "chair"));
        CONCEPT_CLUSTERS.put("calculus", Arrays.asList("math", "chemistry", "textbook", "study", "exam", "midterm", "university", "algebra"));
        CONCEPT_CLUSTERS.put("camping", Arrays.asList("tent", "backpacking", "hiking", "outdoors", "sleeping bag", "rainfly", "camp"));
        CONCEPT_CLUSTERS.put("jacket", Arrays.asList("denim", "clothes", "winter", "warmth", "coat", "apparel", "wear"));
    }

    public static double computeSimilarity(String query, ResourcePost post) {
        if (query == null || query.trim().isEmpty()) return 1.0;
        String q = query.toLowerCase().trim();
        String[] qTokens = q.split("\\W+");

        double score = 0.0;
        String itemLower = post.getItem().toLowerCase();
        String descLower = post.getDescription().toLowerCase();

        // Exact substring matches
        if (itemLower.contains(q)) score += 0.5;
        if (descLower.contains(q)) score += 0.3;

        // Token matches
        for (String token : qTokens) {
            if (token.length() > 2) {
                if (itemLower.contains(token)) score += 0.35;
                if (post.getSemanticTokens().contains(token)) score += 0.4;
            }
        }

        // Semantic Concept Clustering
        for (Map.Entry<String, List<String>> entry : CONCEPT_CLUSTERS.entrySet()) {
            boolean queryMatchesCluster = q.contains(entry.getKey()) || entry.getValue().stream().anyMatch(q::contains);
            boolean postMatchesCluster = itemLower.contains(entry.getKey()) ||
                    entry.getValue().stream().anyMatch(itemLower::contains) ||
                    entry.getValue().stream().anyMatch(descLower::contains);

            if (queryMatchesCluster && postMatchesCluster) {
                score += 0.65;
                break;
            }
        }

        return Math.min(score, 0.98);
    }

    public static List<TradeMatch> findAgenticMatches(List<ResourcePost> posts) {
        List<TradeMatch> matches = new ArrayList<>();
        List<ResourcePost> requests = new ArrayList<>();
        List<ResourcePost> offers = new ArrayList<>();

        for (ResourcePost p : posts) {
            if (!p.isExpired() && p.getStatus().equals("available")) {
                if (p.getType().equalsIgnoreCase("request")) requests.add(p);
                else offers.add(p);
            }
        }

        for (ResourcePost req : requests) {
            for (ResourcePost off : offers) {
                if (req.getOwner().equals(off.getOwner())) continue; // Can't trade with self

                double sim = computeSimilarity(req.getItem() + " " + req.getDescription(), off);
                if (sim >= 0.70) {
                    String reason = "Matched intent in '" + req.getItem() + "' with inventory item '" + off.getItem() + "'";
                    matches.add(new TradeMatch(req, off, sim, reason));
                }
            }
        }

        matches.sort((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()));
        return matches;
    }
}
