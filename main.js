import "./style.css"
import * as patristic from "patristic"
import { uniqueNamesGenerator, animals, countries, colors, names } from "unique-names-generator"

const dictionaries = [animals, countries, colors, names]

let masterBranch, tree
const averageMutationAmount = 2
const deathProbability = 0.55
const maxGenerations = 10
const sourceName = "Triticum"
const finalSurvivingAverage = 5

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

const setOnlyEndLabels = () => {
  // tree.eachLeafLabel((s) => {
  //   const title = s.innerHTML
  //   console.log(s.innerHTML)
  //   const branch = masterBranch.getDescendant(title)
  //   const depth = branch.data.depth || branch.depth
  //   if (depth === maxGenerations && !branch.data.isDead) {
  //     s.style.fill = "white"
  //     s.style.opacity = 1
  //     console.log("set end", title)
  //   }
  // })
}

const startGeneration = () => {
  masterBranch = new patristic.Branch({ id: "master" })
  tree = new TidyTree(masterBranch.toNewick(), {
    parent: "body",
    layout: "circular",
    mode: "square",
    leafLabels: true,
    branchLabels: true,
    ruler: false,
  })

  tree.eachLeafLabel((s) => {
    s.style.fill = "white"
    s.style.opacity = 0
  })
  tree.eachBranchNode((s) => {
    s.style.fill = "white"
  })

  let currentDepth = 0
  let generationInterval = setInterval(() => {
    const idsToAppendTo = getChildrensIdForDepth(currentDepth)

    if (!idsToAppendTo.length) {
      clearInterval(generationInterval)
      // startGeneration()
    }
    idsToAppendTo.forEach((id) => createChildForBranchId(id, currentDepth + 1))

    currentDepth++

    tree.setTree(masterBranch.toNewick())
    tree.recenter()
    if (currentDepth >= maxGenerations) {
      console.log("stop !!!")
      clearInterval(generationInterval)
      setOnlyEndLabels()
    }

    tree.eachLeafNode((s) => {
      const title = s.getAttribute("title")
      const branch = masterBranch.getDescendant(title)
      if (branch && branch.data.isDead) {
        s.style.fill = "red"
      }
    })
  }, 1400)
}

startGeneration()
