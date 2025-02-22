var expect = require("../chai").expect;
var Graph = require("@dagrejs/graphlib").Graph;
var normalizeRanks = require("../../lib/util").normalizeRanks;
var rankUtil = require("../../lib/rank/util");
var longestPath = rankUtil.longestPath;

describe("rank/util", () => {
  describe("longestPath", () => {
    var g;

    beforeEach(() => {
      g = new Graph()
        .setDefaultNodeLabel(() => ({}))
        .setDefaultEdgeLabel(() => ({ minlen: 1 }));
    });

    it("can assign a rank to a single node graph", () => {
      g.setNode("a");
      longestPath(g);
      normalizeRanks(g);
      expect(g.node("a").rank).to.equal(0);
    });

    it("can assign ranks to unconnected nodes", () => {
      g.setNode("a");
      g.setNode("b");
      longestPath(g);
      normalizeRanks(g);
      expect(g.node("a").rank).to.equal(0);
      expect(g.node("b").rank).to.equal(0);
    });

    it("can assign ranks to connected nodes", () => {
      g.setEdge("a", "b");
      longestPath(g);
      normalizeRanks(g);
      expect(g.node("a").rank).to.equal(0);
      expect(g.node("b").rank).to.equal(1);
    });

    it("can assign ranks for a diamond", () => {
      g.setPath(["a", "b", "d"]);
      g.setPath(["a", "c", "d"]);
      longestPath(g);
      normalizeRanks(g);
      expect(g.node("a").rank).to.equal(0);
      expect(g.node("b").rank).to.equal(1);
      expect(g.node("c").rank).to.equal(1);
      expect(g.node("d").rank).to.equal(2);
    });

    it("uses the minlen attribute on the edge", () => {
      g.setPath(["a", "b", "d"]);
      g.setEdge("a", "c");
      g.setEdge("c", "d", { minlen: 2 });
      longestPath(g);
      normalizeRanks(g);
      expect(g.node("a").rank).to.equal(0);
      // longest path biases towards the lowest rank it can assign
      expect(g.node("b").rank).to.equal(2);
      expect(g.node("c").rank).to.equal(1);
      expect(g.node("d").rank).to.equal(3);
    });
  });
});
