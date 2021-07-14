import type { Graph } from "graphlib";
import type { App } from "obsidian";
import { nodeIntersection } from "src/GeneralGraphFn";
import type { AnalysisForAll, AnalysisObj, LinkPredictionAlg, ResolvedLinks } from "src/Interfaces";
import { linkedQ, roundNumber, sum } from "src/Utility";

export const adamicAdarLinkPrediction: LinkPredictionAlg = (g: Graph, a: string, b: string): number => {
    const [Na, Nb] = [g.neighbors(a) as string[], g.neighbors(b) as string[]];
    const Nab = nodeIntersection(Na, Nb);

    if (Nab.length) {
        const neighbours: number[] = Nab.map(node => (g.successors(node) as string[]).length)
        return roundNumber(sum(neighbours.map(neighbour => 1 / Math.log(neighbour))))
    } else {
        return Infinity
    }
}

// export { adamicAdarLinkPrediction };

export const commonNeighboursLinkPrediction: LinkPredictionAlg = (g: Graph, a: string, b: string): number => {
    const [Na, Nb] = [g.neighbors(a) as string[], g.neighbors(b) as string[]];
    const Nab = nodeIntersection(Na, Nb)
    return Nab.length
}

export const linkPredictionsForAll: AnalysisForAll = (
    alg: LinkPredictionAlg,
    g: Graph,
    currNode: string,
    resolvedLinks: ResolvedLinks) => {
    const predictionsArr: AnalysisObj[] = []
    const paths = g.nodes();

    for (let i = 0; i < paths.length; i++) {
        const a = paths[i];

        const prediction = alg(g, a, currNode)
        predictionsArr[i] = {
            from: currNode,
            to: a,
            measure: prediction,
            linked: linkedQ(resolvedLinks, currNode, a)
        }
    }
    return predictionsArr
}

export const LINK_PREDICTION_TYPES: {
    subtype: string,
    alg: LinkPredictionAlg
}[] = [
        { subtype: 'Adamic Adar', alg: adamicAdarLinkPrediction },
        { subtype: 'Common Neighbours', alg: commonNeighboursLinkPrediction }
    ]