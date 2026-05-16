// data/codingQuestions.js
// Add as many questions as you want here.
// This file is imported by server.js for seeding MongoDB.

export const codingQuestionsData = [
  // ─── ARRAYS ───────────────────────────────────────────────
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputFormat: "First line: array of integers\nSecond line: target integer",
    outputFormat: "Array of two indices [i, j] where nums[i] + nums[j] === target",
    sampleInput: "[2,7,11,15]\n9",
    sampleOutput: "[0,1]",
    starterCode:
      "function twoSum(nums, target) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given a sorted array of integers and a target value, implement binary search to find the target. Return its index if found, otherwise return -1.",
    inputFormat: "First line: sorted array of integers\nSecond line: target value",
    outputFormat: "Index of target or -1 if not found",
    sampleInput: "[-1,0,3,5,9,12]\n9",
    sampleOutput: "4",
    starterCode:
      "function binarySearch(nums, target) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Merge Sorted Arrays",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given two sorted integer arrays, merge them into a single sorted array and return it.",
    inputFormat: "Two lines, each containing a sorted array of integers",
    outputFormat: "Single merged sorted array",
    sampleInput: "[1,2,3]\n[2,5,6]",
    sampleOutput: "[1,2,2,3,5,6]",
    starterCode:
      "function mergeSortedArrays(nums1, nums2) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Find Maximum Subarray",
    difficulty: "Medium",
    topic: "Arrays",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. (Kadane's Algorithm)",
    inputFormat: "Array of integers (may include negatives)",
    outputFormat: "Maximum subarray sum as an integer",
    sampleInput: "[-2,1,-3,4,-1,2,1,-5,4]",
    sampleOutput: "6",
    starterCode:
      "function maxSubArray(nums) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Rotate Array",
    difficulty: "Medium",
    topic: "Arrays",
    description:
      "Given an array, rotate the array to the right by k steps, where k is non-negative.",
    inputFormat: "First line: array of integers\nSecond line: k (number of steps)",
    outputFormat: "Rotated array",
    sampleInput: "[1,2,3,4,5,6,7]\n3",
    sampleOutput: "[5,6,7,1,2,3,4]",
    starterCode:
      "function rotate(nums, k) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Find Duplicate Number",
    difficulty: "Medium",
    topic: "Arrays",
    description:
      "Given an array of integers nums containing n+1 integers where each integer is in the range [1, n], find the one duplicate number without modifying the array and using only constant extra space.",
    inputFormat: "Array of integers",
    outputFormat: "The duplicate number",
    sampleInput: "[1,3,4,2,2]",
    sampleOutput: "2",
    starterCode:
      "function findDuplicate(nums) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Arrays",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    inputFormat: "Array of non-negative integers representing heights",
    outputFormat: "Total amount of trapped water",
    sampleInput: "[0,1,0,2,1,0,1,3,2,1,2,1]",
    sampleOutput: "6",
    starterCode:
      "function trap(height) {\n    // Write your code here\n    \n}",
  },

  // ─── STRINGS ──────────────────────────────────────────────
  {
    title: "Reverse String",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    inputFormat: "Array of characters",
    outputFormat: "Reversed array of characters (in-place)",
    sampleInput: "['h','e','l','l','o']",
    sampleOutput: "['o','l','l','e','h']",
    starterCode:
      "function reverseString(s) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if every open bracket is closed by the same type of bracket in the correct order.",
    inputFormat: "String of bracket characters",
    outputFormat: "true if valid, false otherwise",
    sampleInput: "()[]{} ",
    sampleOutput: "true",
    starterCode:
      "function isValid(s) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Strings",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    inputFormat: "String s",
    outputFormat: "Length of the longest substring without repeating characters",
    sampleInput: "abcabcbb",
    sampleOutput: "3",
    starterCode:
      "function lengthOfLongestSubstring(s) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another.",
    inputFormat: "Two strings s and t",
    outputFormat: "true if t is an anagram of s, false otherwise",
    sampleInput: "anagram\nnagaram",
    sampleOutput: "true",
    starterCode:
      "function isAnagram(s, t) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topic: "Strings",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    inputFormat: "String s",
    outputFormat: "Longest palindromic substring",
    sampleInput: "babad",
    sampleOutput: "bab",
    starterCode:
      "function longestPalindrome(s) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    topic: "Strings",
    description:
      "Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If no such window exists, return an empty string.",
    inputFormat: "First line: string s\nSecond line: string t",
    outputFormat: "Minimum window substring or empty string",
    sampleInput: "ADOBECODEBANC\nABC",
    sampleOutput: "BANC",
    starterCode:
      "function minWindow(s, t) {\n    // Write your code here\n    \n}",
  },

  // ─── LINKED LIST ──────────────────────────────────────────
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    inputFormat: "Head node of a linked list",
    outputFormat: "Head of the reversed linked list",
    sampleInput: "[1,2,3,4,5]",
    sampleOutput: "[5,4,3,2,1]",
    starterCode:
      "function reverseList(head) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    description:
      "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list and return the head of the merged list.",
    inputFormat: "Two sorted linked lists",
    outputFormat: "Head of merged sorted linked list",
    sampleInput: "[1,2,4]\n[1,3,4]",
    sampleOutput: "[1,1,2,3,4,4]",
    starterCode:
      "function mergeTwoLists(list1, list2) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Detect Cycle in Linked List",
    difficulty: "Medium",
    topic: "Linked List",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle, otherwise return false. Use Floyd's cycle-finding algorithm.",
    inputFormat: "Head of a linked list (with possible cycle)",
    outputFormat: "true if cycle exists, false otherwise",
    sampleInput: "[3,2,0,-4] (tail connects to node at index 1)",
    sampleOutput: "true",
    starterCode:
      "function hasCycle(head) {\n    // Write your code here\n    \n}",
  },
  {
    title: "LRU Cache",
    difficulty: "Hard",
    topic: "Linked List",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) operations, both in O(1) time.",
    inputFormat: "Operations: [[capacity], [get,key], [put,key,value], ...]",
    outputFormat: "Results of each get operation",
    sampleInput: "[[2],[put,1,1],[put,2,2],[get,1],[put,3,3],[get,2],[put,4,4],[get,1],[get,3],[get,4]]",
    sampleOutput: "[null,null,null,1,null,-1,null,-1,3,4]",
    starterCode:
      "class LRUCache {\n    constructor(capacity) {\n        // Write your code here\n    }\n    get(key) {\n        // Write your code here\n    }\n    put(key, value) {\n        // Write your code here\n    }\n}",
  },

  // ─── TREES ────────────────────────────────────────────────
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Trees",
    description:
      "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    inputFormat: "Root of a binary tree",
    outputFormat: "Maximum depth as an integer",
    sampleInput: "[3,9,20,null,null,15,7]",
    sampleOutput: "3",
    starterCode:
      "function maxDepth(root) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    topic: "Trees",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST requires the left subtree to contain only nodes with keys less than the node's key, and the right subtree only nodes with keys greater.",
    inputFormat: "Root of a binary tree",
    outputFormat: "true if valid BST, false otherwise",
    sampleInput: "[2,1,3]",
    sampleOutput: "true",
    starterCode:
      "function isValidBST(root) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Lowest Common Ancestor",
    difficulty: "Medium",
    topic: "Trees",
    description:
      "Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes p and q.",
    inputFormat: "Root of BST and two node values p and q",
    outputFormat: "Value of the lowest common ancestor node",
    sampleInput: "[6,2,8,0,4,7,9,null,null,3,5]\np=2, q=8",
    sampleOutput: "6",
    starterCode:
      "function lowestCommonAncestor(root, p, q) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Trees",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    inputFormat: "Root of a binary tree",
    outputFormat: "2D array of node values by level",
    sampleInput: "[3,9,20,null,null,15,7]",
    sampleOutput: "[[3],[9,20],[15,7]]",
    starterCode:
      "function levelOrder(root) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    topic: "Trees",
    description:
      "Design an algorithm to serialize and deserialize a binary tree. Serialization converts the tree to a string; deserialization reconstructs the tree from that string.",
    inputFormat: "Root of a binary tree",
    outputFormat: "Serialized string (and back to tree)",
    sampleInput: "[1,2,3,null,null,4,5]",
    sampleOutput: "[1,2,3,null,null,4,5]",
    starterCode:
      "function serialize(root) {\n    // Write your code here\n}\nfunction deserialize(data) {\n    // Write your code here\n}",
  },

  // ─── DYNAMIC PROGRAMMING ──────────────────────────────────
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    inputFormat: "Integer n (number of steps)",
    outputFormat: "Number of distinct ways to climb to the top",
    sampleInput: "5",
    sampleOutput: "8",
    starterCode:
      "function climbStairs(n) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount. If it cannot be made up, return -1.",
    inputFormat: "First line: array of coin denominations\nSecond line: target amount",
    outputFormat: "Minimum number of coins or -1",
    sampleInput: "[1,5,11]\n15",
    sampleOutput: "3",
    starterCode:
      "function coinChange(coins, amount) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence derived from another by deleting some elements without changing the order of remaining elements.",
    inputFormat: "Two strings text1 and text2",
    outputFormat: "Length of longest common subsequence",
    sampleInput: "abcde\nace",
    sampleOutput: "3",
    starterCode:
      "function longestCommonSubsequence(text1, text2) {\n    // Write your code here\n    \n}",
  },
  {
    title: "0/1 Knapsack",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "Given weights and values of n items and a knapsack capacity W, find the maximum value subset such that total weight does not exceed W. Each item can only be taken once.",
    inputFormat: "First line: array of weights\nSecond line: array of values\nThird line: capacity W",
    outputFormat: "Maximum value achievable",
    sampleInput: "[1,3,4,5]\n[1,4,5,7]\n7",
    sampleOutput: "9",
    starterCode:
      "function knapsack(weights, values, W) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Word Break",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description:
      "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    inputFormat: "First line: string s\nSecond line: array of dictionary words",
    outputFormat: "true if s can be segmented, false otherwise",
    sampleInput: "leetcode\n[leet,code]",
    sampleOutput: "true",
    starterCode:
      "function wordBreak(s, wordDict) {\n    // Write your code here\n    \n}",
  },

  // ─── GRAPHS ───────────────────────────────────────────────
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs",
    description:
      "Given an m x n 2D binary grid where '1' represents land and '0' represents water, return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    inputFormat: "2D grid of '1's and '0's",
    outputFormat: "Number of islands",
    sampleInput: '[\n["1","1","0","0","0"],\n["1","1","0","0","0"],\n["0","0","1","0","0"],\n["0","0","0","1","1"]\n]',
    sampleOutput: "3",
    starterCode:
      "function numIslands(grid) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    topic: "Graphs",
    description:
      "There are numCourses you have to take. Some courses have prerequisites. Given numCourses and a list of prerequisite pairs, return true if you can finish all courses (i.e., no cycle exists in the dependency graph).",
    inputFormat: "First line: numCourses\nSecond line: array of [course, prerequisite] pairs",
    outputFormat: "true if all courses can be finished, false otherwise",
    sampleInput: "2\n[[1,0]]",
    sampleOutput: "true",
    starterCode:
      "function canFinish(numCourses, prerequisites) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Dijkstra's Shortest Path",
    difficulty: "Hard",
    topic: "Graphs",
    description:
      "Given a weighted directed graph with n nodes and edges, find the shortest path from source node 0 to all other nodes using Dijkstra's algorithm.",
    inputFormat: "First line: n (nodes)\nSecond line: edges as [u, v, weight]\nThird line: source node",
    outputFormat: "Array of shortest distances from source to each node",
    sampleInput: "5\n[[0,1,10],[0,2,3],[1,3,2],[2,1,4],[2,3,8],[2,4,2],[3,4,5],[4,3,1]]\n0",
    sampleOutput: "[0,7,3,9,5]",
    starterCode:
      "function dijkstra(n, edges, src) {\n    // Write your code here\n    \n}",
  },

  // ─── STACKS & QUEUES ──────────────────────────────────────
  {
    title: "Min Stack",
    difficulty: "Easy",
    topic: "Stacks & Queues",
    description:
      "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement MinStack with push(val), pop(), top(), and getMin() methods.",
    inputFormat: "Operations: [[push,val],[pop],[top],[getMin],...]",
    outputFormat: "Results of top and getMin operations",
    sampleInput: "[[push,-2],[push,0],[push,-3],[getMin],[pop],[top],[getMin]]",
    sampleOutput: "[-3,0,-2]",
    starterCode:
      "class MinStack {\n    constructor() {\n        // Write your code here\n    }\n    push(val) {}\n    pop() {}\n    top() {}\n    getMin() {}\n}",
  },
  {
    title: "Implement Queue Using Stacks",
    difficulty: "Easy",
    topic: "Stacks & Queues",
    description:
      "Implement a first-in-first-out (FIFO) queue using only two stacks. The queue should support push, pop, peek, and empty operations.",
    inputFormat: "Operations: [[push,val],[pop],[peek],[empty],...]",
    outputFormat: "Results of pop, peek, and empty operations",
    sampleInput: "[[push,1],[push,2],[peek],[pop],[empty]]",
    sampleOutput: "[1,1,false]",
    starterCode:
      "class MyQueue {\n    constructor() {\n        // Write your code here\n    }\n    push(x) {}\n    pop() {}\n    peek() {}\n    empty() {}\n}",
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    topic: "Stacks & Queues",
    description:
      "Given an array of integers heights representing the histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    inputFormat: "Array of non-negative integers representing bar heights",
    outputFormat: "Area of the largest rectangle",
    sampleInput: "[2,1,5,6,2,3]",
    sampleOutput: "10",
    starterCode:
      "function largestRectangleArea(heights) {\n    // Write your code here\n    \n}",
  },

  // ─── SORTING & SEARCHING ──────────────────────────────────
  {
    title: "Bubble Sort",
    difficulty: "Easy",
    topic: "Sorting",
    description:
      "Implement the bubble sort algorithm to sort an array of integers in ascending order.",
    inputFormat: "Unsorted array of integers",
    outputFormat: "Sorted array in ascending order",
    sampleInput: "[64,34,25,12,22,11,90]",
    sampleOutput: "[11,12,22,25,34,64,90]",
    starterCode:
      "function bubbleSort(arr) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Merge Sort",
    difficulty: "Medium",
    topic: "Sorting",
    description:
      "Implement merge sort, a divide-and-conquer sorting algorithm. Split the array in half, sort each half recursively, and merge the sorted halves.",
    inputFormat: "Unsorted array of integers",
    outputFormat: "Sorted array in ascending order",
    sampleInput: "[38,27,43,3,9,82,10]",
    sampleOutput: "[3,9,10,27,38,43,82]",
    starterCode:
      "function mergeSort(arr) {\n    // Write your code here\n    \n}",
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Sorting",
    description:
      "There is an integer array nums sorted in ascending order (with distinct values). The array is possibly rotated at an unknown pivot. Given the array after the possible rotation and an integer target, return the index of target or -1 if not found.",
    inputFormat: "First line: rotated sorted array\nSecond line: target",
    outputFormat: "Index of target or -1",
    sampleInput: "[4,5,6,7,0,1,2]\n0",
    sampleOutput: "4",
    starterCode:
      "function search(nums, target) {\n    // Write your code here\n    \n}",
  },
];