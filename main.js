import "./style.css"
import * as patristic from "patristic"
import { uniqueNamesGenerator, animals, countries, colors, names } from "unique-names-generator"

const dictionaries = [animals, countries, colors, names]

const masterBranch = new patristic.Branch({ id: "master" })
let tree = new TidyTree(masterBranch.toNewick(), {
  parent: "body",
  layout: "circular",
  mode: "square",
  leafLabels: true,
  branchLabels: true,
})

const averageMutationAmount = 2
const deathProbability = 0.6
const maxGenerations = 8
const sourceName = "Triticum"

const createChildForBranchId = (branchId, depth) => {
  const matchBranch = masterBranch.getDescendant(branchId)
  if (!matchBranch) return

  let numberOfMutations = 0
  numberOfMutations = Math.floor(Math.random() * averageMutationAmount) + 1
  if (depth < 2) {
    numberOfMutations = averageMutationAmount
  }
  for (let i = 0; i <= numberOfMutations; i++) {
    const id =
      sourceName +
      " " +
      uniqueNamesGenerator({
        dictionaries: [dictionaries[Math.floor(Math.random() * dictionaries.length)]],
        length: 1,
      })
    matchBranch.addChild({ id, depth, isDead: depth < 2 ? false : Math.random() < deathProbability })
  }
}

const getChildrensIdForDepth = (depth) => {
  const branchIds = []
  masterBranch.each((branch) => {
    if (branch.data.isDead) return
    console.log(branch.data.isDead)
    if (branch.data?.depth === depth || branch.depth === depth) branchIds.push(branch.id)
  })
  return branchIds
}

const startGeneration = () => {
  let currentDepth = 0
  let generationInterval = setInterval(() => {
    console.log(masterBranch)
    const idsToAppendTo = getChildrensIdForDepth(currentDepth)
    console.log(idsToAppendTo)
    idsToAppendTo.forEach((id) => createChildForBranchId(id, currentDepth + 1))
    currentDepth++
    tree.setTree(masterBranch.toNewick())
    if (currentDepth > maxGenerations) clearInterval(generationInterval)

    tree.eachLeafNode((s) => {
      const title = s.getAttribute("title")
      const branch = masterBranch.getDescendant(title)
      if (branch && branch.data.isDead) {
        s.style.fill = "red"
      }
    })
  }, 1000)
}

startGeneration()
