export type Topic = {
  id: string;
  name: string;
  questions: string[];
};

const QUESTIONS_BASICS: string[] = [
  "Write a program to print \"Hello, World!\".",
  "Read two integers from the user and print their sum, difference, product, and quotient.",
  "Swap two numbers (a) using a temporary variable, (b) without a temporary variable.",
  "Check whether a given number is even or odd.",
  "Check whether a given year is a leap year.",
  "Find the largest of three numbers using if-else.",
  "Print the multiplication table of a given number.",
  "Find the sum of digits of a given integer. Input: n = 1234;",
  "Reverse a given integer. Input: n = 1234;",
  "Check if a number is a palindrome. Input: n = 121;",
  "Check if a number is an Armstrong number. Input: n = 153;",
  "Check if a number is a prime number. Input: n = 17;",
  "Print all prime numbers between 1 and N. Input: N = 50;",
  "Print the Fibonacci series up to N terms using a loop. Input: N = 10;",
  "Compute the factorial of a number using a loop. Input: n = 6;",
  "Count the number of digits in a given integer. Input: n = 456789;",
  "Convert a decimal number to binary (without library calls). Input: n = 13;",
  "Find the HCF (GCD) and LCM of two numbers. Input: a = 12, b = 18;",
  "Print the following pattern: a right-angled triangle of stars with n rows. Input: n = 5;",
  "Print Pascal's triangle up to n rows. Input: n = 5;",
  "Use a switch statement to print the day name for a given number (1–7).",
  "Take a character as input and check whether it is a vowel or a consonant.",
  "Take a string and count the number of vowels in it. Input: \"education\";",
  "Find the ASCII value of a given character. Input: ch = 'A';",
  "Take 5 integers as input and store them in an array; print the array in reverse order."
];

const QUESTIONS_ARRAYS: string[] = [
`
Two sum problem
1.Given an array of integers nums and an integer target, return the indices of two numbers such that they add up to the target.
nums = [2, 7, 11, 15]
target = 9

varient
2. Return Numbers Instead of Indices
nums = [2, 7, 11, 15]
target = 9
Outupt:- 
[2,7]

3. Count Number of Pairs
Input
nums = [1, 2, 3, 4, 5]
target = 5


4. Print All Pairs
Input
nums = [1,2,3,4,5]
target = 5

Output:-
(1,4)
(2,3)

Two Sum in Sorted Array
Array is already sorted.
Input
nums = [1,2,4,6,10]
target = 8
Output
[2,4]

Use Two Pointers:

left = 0
right = n - 1

Time: O(n)
Space: O(1)

Find Pair Closest to Target
Input
nums = [1,3,4,7,10]
target = 15
`,
`
Three sum problem
Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. 
Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.

Example 2:
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.

Example 3:
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.

To solve this question first need to try
The Sub-Problem: (needs to solve using two pointers only)
Given a sorted array of numbers and a target value, find two numbers that add up exactly to that target.
Input: nums = [1, 2, 4, 5, 8, 11], target = 13

Output: [2, 11] (or their indices depending on the requirement)
`,

`
Find whether the array is fibnoccie or not ?
Input:- 
int [] b= {0,1,1,2,3,5,8,13,20};
Output:- 
False

int [] b= {0,1,1,2,3,5,8,13,21};
Output:- 
true


`,
  `
From an array of random natural numbers, return the distance/difference between the two closest numbers.
int[] myArray = {19, 50, 99, 7, 98, 14, 65};
99 and 98 are closest and distance between these is 99-98=1
  `,
  `
Finding the sum of digits of a number until the sum becomes a single digit.
Input : 1234
Output : 1
Explanation : The sum of 1+2+3+4 = 10,
digSum(x) == 10
Hence ans will be 1+0 = 1
Input : 5674
Output : 4
  `,
  
  "Find the largest element in an array without sorting. Input: int[] arr = {10, 5, 23, 7, 41, 2};",
  "Find the smallest element in an array without sorting. Input: int[] arr = {10, 5, 23, 7, 41, 2};",
  "Find the second-largest element in an array in a single pass. Input: int[] arr = {4, 7, 1, 9, 2, 9, 6};",
  "Reverse an array in place (no extra array). Input: int[] arr = {1, 2, 3, 4, 5};",
  "Rotate an array to the right by k positions. Input: int[] arr = {1,2,3,4,5,6,7}; int k = 3;",
  "Move all zeroes to the end of the array while keeping non-zero order. Input: int[] arr = {0,1,0,3,12};",
  "Find the missing number in an array of 1..n with one number missing. Input: int[] arr = {1,2,4,5,6}; n = 6;",
  `Find the duplicate number in an array of 1..n where one number repeats. 
    Input: int[] arr = {1,3,4,2,2};
    Output:- 2

    Problem can be solve using
 1. HashSet to track seen numbers (O(n) time, O(n) space)
 2. Sorting the array and checking adjacent elements (O(n log n) time, O(1) space)
 3. Floyd's Tortoise and Hare (Cycle Detection) algorithm (O(n) time, O(1) space)
  `,
  "Find the pair in the array whose sum equals a target. Input: int[] arr = {2,7,11,15}; target = 9;",
  `Find the maximum subarray sum (Kadane's algorithm). 
   Input: int[] arr = {-2,1,-3,4,-1,2,1,-5,4};
   Output: 6 (subarray [4,-1,2,1] has the largest sum)

   Problem Can Be Solved Using:
    1. Kadane's algorithm (O(n) time, O(1) space)
    2. Divide and conquer (O(n log n) time, O(log n) space)
    3. Dynamic programming (O(n) time, O(n) space)
    4. Stream API with reduce (O(n) time, O(1) space)
  `,
  `Merge two sorted arrays into one sorted array. 
   Input: 
   int[] a = {1,3,5}; 
   int[] b = {2,4,6};
   Output: [1, 2, 3, 4, 5]
   
      Problem Can Be Solved Using:
    1. Two pointers (O(n) time, O(n) space)
    2. Min-heap (O(n log k) time, O(k) space)
    3. Stream API (O(n) time, O(n) space) 
   `,
  `Remove duplicates from a sorted array in place. 
   Input: int[] arr = {1,1,2,2,3,4,4,5};
   Output: 5 (the first 5 elements of arr will be 1,2,3,4,5)
   
   Problem Can Be Solved Using:
   1. Two pointers (O(n) time, O(1) space)
   2. HashSet (O(n) time, O(n) space)
   3. Sorting + unique (O(n log n) time, O(1) space)
   4. Stream API (O(n) time, O(n) space)
  
  `,
  "Find the intersection of two arrays. Input: int[] a = {1,2,2,1}; int[] b = {2,2};",
  "Find the union of two arrays (distinct values). Input: int[] a = {1,2,2,3}; int[] b = {2,3,4};",
  "Count the number of even and odd numbers in an array. Input: int[] arr = {1,2,3,4,5,6,7,8};",
  `Find the frequency of each element in an array. 
  Input: int[] arr = {1,2,2,3,3,3,4};
  Output:{1: 1, 2: 2, 3: 3, 4: 1}

  Problem Can Be Solved Using:
  1. HashMap to count frequencies (O(n) time, O(n) space)
  2. Sorting the array and counting adjacent elements (O(n log n) time, O(1) space)
  3. Stream API with groupingBy (O(n) time, O(n) space)
  `,
  "Check if an array is sorted in ascending order. Input: int[] arr = {1,2,3,5,4};",
  `
  Find the leaders in an array — elements greater than all elements to their right. 
  Input: int[] arr = {16,17,4,3,5,2};
  output: 17, 5, 2
  `
  ,
  "Rearrange the array so that positive and negative numbers alternate. Input: int[] arr = {1,2,3,-4,-1,4};",
  `Left rotate an array by k positions using the reverse trick (reverse 0..k-1, reverse k..n-1, reverse 0..n-1). 
   Input: int[] arr = {1,2,3,4,5}; int k = 2;
   1st rotation: 2 3 4 5 1
   2nd rotation: 3 4 5 1 2
   Output: {3,4,5,1,2}

   
  `,
  "Left rotate an array by one position. Input: int[] arr = {1,2,3,4,5}; Output: {2,3,4,5,1}",
  "Right rotate an array by one position. Input: int[] arr = {1,2,3,4,5}; Output: {5,1,2,3,4}",
  "Find the maximum number of consecutive 1s in a binary array. Input: int[] arr = {1,1,0,1,1,1};",
  `Find the element that appears only once while every other element appears twice. 
   Input: int[] arr = {4,1,2,1,2}; 
   Output:- 4

   Problem Can Be Solved Using: 
   1. HashMap to count frequencies (O(n) time, O(n) space)
   2. XOR operation (O(n) time, O(1) space)

  `,


  "Move all negative numbers to the left and positive numbers to the right (order need not be preserved). Input: int[] arr = {1,-2,3,-4,5,-6};",
  "Sort an array containing only 0s, 1s, and 2s in a single pass (Dutch National Flag). Input: int[] arr = {1,0,1,2,0,1,1,2,0,0};",
  "Find the maximum product subarray (modified Kadane's). Input: int[] arr = {2,3,-2,4};",
  "Print every subarray of an array using nested loops. Input: int[] arr = {1,2,3};",
  "Find the sum of all subarrays in O(n) using the contribution technique arr[i] * (i+1) * (n-i). Input: int[] arr = {1,2,3};",
  "Find the third-largest distinct element in an array in a single pass. Input: int[] arr = {1,2,3,4,5};",
  `Find the maximum product of any triplet (subsequence of size 3) in the array. Input: int[] arr = {10,3,5,6,20};
   Input: int[] arr = {-10, -3, 5, 6, -20};
   Output: 1200 (10*6*20)
  Steps to build the problem logic
    1. Top 3 largest
    2. Top 2 smallest
    3. Maximum pair product
    4. Maximum triplet product
  
  `,
  `Minimize the maximum difference between the heights after adding or subtracting k from each element. 
   Input: int k = 2; int[] arr = {1,5,8,10};
   Explanation: The array can be modified as [1+k, 5-k, 8-k, 10-k]= [3, 3, 6, 8]. 
   The difference between the largest and the smallest is 8 - 3 = 5. 
   Output: 5

   problem can be solved using:
    1. Sorting + two pointers (O(n log n) time, O(1) space)  
  `,
  `Find the duplicate number in an array of N+1 integers where each integer is in range [1,N]. Input: int[] arr = {1,3,4,2,2};
   
  

  Explanation:
  if we map the indeqs to the values, we get a linked list with a cycle:
  0 1 2 3 4
  | | | | |
  v v v v v
  1 3 4 2 2


  0 → 1 → 3 → 2 → 4 → 2 → 4 → ...
                ↑     ↓
                ← ← ←

  We can check the cycle repetition   

  Problem Can Be Solved Using:
  1. HashSet to track seen numbers (O(n) time, O(n) space)
  2. Sorting the array and checking adjacent elements (O(n log n) time, O(1) space)
  3. Floyd's Tortoise and Hare (Cycle Detection) algorithm (O(n) time, O(1) space)
  `,

  "Find two numbers in the array whose sum equals the target and return their indices. Input: int[] arr = {2,6,5,8,11}; int target = 19;"
];

const QUESTIONS_STRINGS: string[] = [
  `Find the longest substring without repeating characters. 
  Input: \"abcabcbb\"; Output: 3
  Input: \"bbbb\"; Output: 1

  Try to solve first 
  1. O(N3) 3 loops
  2. O(N2) 2 for loops
  3. O(N) 1 for loop and 1 while loop
  4. O(N) optimal solution
  `,

  `
    Find the longest palindromic substring
    Example 1:
    Input: "babad"
    Output: "bab" (or "aba" — both are valid, length 3)

    To understand solve this question first try with mini problems 
    1.Print all possible substrings
    2.Check If a Single Substring is a Palindrome
    3.Combine Them (The Brute Force Solution)
  `,

  "Check if one string is a rotation of another. Input: str1 = \"abcde\", str2 = \"cdeab\";",
  

  `
  Implement strStr() / indexOf() — find the first occurrence of a substring
🧪 Example 1
Input:
haystack = "hello"
needle = "ll"
Output:
2
Explanation: "ll" starts at index 2

🧪 Example 2
Input:
haystack = "aaaaa"
needle = "bba"
Output:
-1
Explanation: "bba" not found

🧪 Example 3
Input:
haystack = "abc"
needle = "c"
Output:
2

🧪 Example 4
Input:
haystack = "abc"
  `,  
  `Group anagrams from an array of strings Input: String arr[] = {"eat", "tea", "tan", "ate", "nat", "bat"}; Output:- {aet=[eat, tea, ate], abt=[bat], ant=[tan, nat]}`,

  "Valid parentheses — check if a string of brackets is balanced. Input: \"({[]})\" → true; Input: \"({[})\" → false.",
 
  "Longest common prefix among an array of strings. Case 1: [\"flower\", \"flow\", \"flight\"] → \"fl\". Case 2: [\"dog\", \"racecar\", \"car\"] → \"\".",
 
  "Check if a string is a valid palindrome considering only alphanumeric characters (ignore case). Input: \"A man, a plan, a canal: Panama\" → true.",
 
  `Convert a Roman numeral to an integer (and vice versa). Input: "III" → 3.
      Map<Character, Integer> map = Map.of(
            'I', 1, 
            'V', 5, 
            'X', 10, 
            'L', 50,
            'C', 100,
            'D', 500,
            'M', 1000
        );

  
  `,
 
  "Find all permutations of a string. Input: String str = \"ABC\"; Output: ABC, ACB, BAC, BCA, CAB, CBA.",
  
`
Reverse only the vowels in a string
Example 1
Input:
 hello
 Output:
 holle
`,

`

Check if two strings are isomorphic
Example 1:- 
Input: s = "egg", t = "add"
Output: true
👉 e → a, g → d (valid mapping)

`,
`String compression (e.g., "aabcccccaaa" → "a2b1c5a3")`
];

const QUESTIONS_RECURSION: string[] = [
  "Compute the factorial of a number using recursion. Input: n = 5;",
  "Compute the nth Fibonacci number using recursion. Input: n = 7;",
  "Compute the sum of digits of a number using recursion. Input: n = 1234;",
  "Reverse a number using recursion. Input: n = 1234; → 4321",
  "Compute the power of a number (a^b) using recursion in O(log b). Input: a = 2, b = 10;",
  "Find the GCD (greatest common divisor) of two numbers using recursion. Input: a = 48, b = 18;",
  "Reverse a string using recursion. Input: String s = \"hello\";",
  "Check if a string is a palindrome using recursion. Input: String s = \"madam\";",
  "Print all elements of an array using recursion. Input: int[] arr = {1,2,3,4};",
  "Find the sum of an array using recursion. Input: int[] arr = {1,2,3,4,5};",
  "Find the maximum element in an array using recursion. Input: int[] arr = {3,7,1,9,4};",
  "Binary search implemented using recursion. Input: int[] arr = {1,3,5,7,9,11}, target = 7;",
  "Generate all subsets (power set) of an array using recursion. Input: int[] arr = {1,2,3};",
  "Generate all permutations of a string using recursion. Input: String s = \"abc\";",
  "Solve the Tower of Hanoi for n disks; print each move. Input: n = 3;",
  "Count the number of ways to climb n stairs (1 or 2 steps at a time). Input: n = 5;",
  "Print numbers from 1 to n using recursion (no loops). Input: n = 5;",
  "Print numbers from n to 1 using recursion (no loops). Input: n = 5;",
  "Check if an array is sorted in ascending order using recursion. Input: int[] arr = {1,2,3,4,5};",
  "Flatten a nested list of integers using recursion. Input: [[1,2],[3,[4,5]],6]",
  "Find the digital root: keep summing the digits of a number recursively until a single digit remains. Input: n = 1234; → 1"
];

const QUESTIONS_STREAMS: string[] = [
`1. Find the Sum of All Elements in a List
Input:- List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};`,

`2. Find the Product of All Elements in a List
Input:- List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};`,

`3. Find the Average of All Elements in a List
Input:- List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};`,

`4. Find the Maximum Element in a List
Input:- List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};`,

`5. Find the Minimum Element in a List
Input:- List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};`,

`6. Count the Number of Elements in a List
Input:- List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};`,

`7. Check if a List Contains a Specific Element
Int number = 2;
List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};`,

`10. Convert a List of Strings to Uppercase
  List<String> words = List.of("hello", "world");`,

`13. Find the Last Element in a List
List<Integer> numbers = List.of(1, 2, 3, 4, 5);
int arr[] = {1,2,3,4,5,6,7};
Need to solve`,

`14. Check if All Elements in a List Satisfy a Condition
List<Integer> numbers = List.of(1, 2, 3, 4, 5);`,

`15. Check if Any Element in a List Satisfies a Condition
List<Integer> numbers = List.of(1, 2, 3, 4, 5);
         System.out.println(removed);`,

`17. Sort a List of Integers in Ascending Order
List<Integer> numbers = List.of(5,6,1, 2, 2, 3, 4, 5);`,

`18. Sort a List of Integers in Descending Order
List<Integer> numbers = List.of(5,6,1, 2, 2, 3, 4, 5);
Using a comparator ?
Without using a comparator ?`,

`19. Sort a List of Strings in Alphabetical Order
List<String> words = List.of("banana", "apple", "cherry");`,

`20. Sort a List of Strings by Their Length
    List<String> words = List.of("banana", "apple", "cherry");`,

`21. Find the Sum of Digits of a Number
 int num = 1234;`,

`24. Find the Second-Smallest Element in a List
 List<Integer> numbers = List.of(1, 2, 3, 4, 5);`,

`25. Find the Longest String in a List
List<String> words = List.of("apple", "banana", "kiwi");`,

`22. Find the Factorial of a Number
        int num = 4;`,

`23. Find the Second-Largest Element in a List
    List<Integer> numbers = List.of(1, 2, 3, 4, 5);`,

`24. Find the Second-Smallest Element in a List
        List<Integer> numbers = List.of(1, 2, 3, 4, 5);`,

`25. Find the Longest String in a List

List<String> words = List.of("apple", "banana", "kiwi");
        String longestString = words.stream().max(Comparator.comparingInt(String::length)).get();
        System.out.println(longestString);`,

`26. Find the Shortest String in a List
   List<String> words = List.of("apple", "banana", "kiwi");`,

`27. Group a List of Strings by Their Length List<String> words = List.of("apple", "banana", "kiwi");`,

`30. Merge Two Lists into a Single List
List<Integer> list1 = List.of(1, 2, 3);
List<Integer> list2 = List.of(4, 5, 6);`,

`31. Find the Intersection of Two Lists
List<Integer> list1 = List.of(1, 2, 3, 4);
List<Integer> list2 = List.of(3, 4, 5, 6);`,

`33. Find the Difference Between Two Lists
List<Integer> list1 = List.of(1, 2, 3, 4);
List<Integer> list2 = List.of(3, 4, 5, 6);`,

`34. Count the Occurrences of Each Element in a List
List<String> words = List.of("apple", "banana", "apple", "orange");`,

`35. Count the Occurrences of Each Character in a String

String input = "hello";

Map<Character, Long> count =  input.chars().mapToObj(ch -> (char) ch).collect(
    Collectors.groupingBy(s -> s, Collectors.counting())

    );`,

`36. Count the Occurrences of Each Word in a String

String input = "hello world hello";`,

`37. Count the Occurrences of Each Vowel in a String

String input = "hello world";`,

`39. Reverse a List Using Streams

List<Integer> numbers = List.of(1, 2, 3, 4);`,

`41. Find the Most Frequent Element in a List
  List<String> words = List.of("apple", "banana", "apple", "orange", "banana", "apple");`,

`42. Find the Least Frequent Element in a List
   List<String> words = List.of("apple", "banana", "apple", "orange", "banana", "apple");


`,

`43. Find the First Non-Repeated Character in a String
String input = "hello";`,

`44. Find the First Repeated Character in a String`,

`45. Check if a String is a Palindrome
   String input = "madam";`,

`46. Find All Anagrams of a String from a List
List<String> words = List.of("listen", "silent", "enlist", "google", "inlets");
String target = "silent";`,

`47. Generate the Fibonacci Sequence Using Streams
int k = 10;
`,

`46. Find All Anagrams of a String from a List
List<String> words = List.of("listen", "silent", "enlist", "google", "inlets");
String target = "silent";`,

`48. Generate a List of Random Numbers Using Streams`,

`49. Flatten a List of Lists into a Single List

List<List<Integer>> listOfLists = List.of(
    List.of(1, 2, 3),
    List.of(4, 5, 6),
    List.of(7, 8, 9)
);`,

`51. Find the Sum of All Odd Numbers in a Nested List`,

`52. Find the Longest Palindrome in a List of Strings
List<String> words = List.of("madam", "racecar", "apple", "banana", "level");`,

`53. Find the Shortest Palindrome in a List of Strings
List<String> words = List.of("madam", "racecar", "apple", "banana", "level");`,

`56. Find the Number of Words in a String
String input = "hello world this is a test";`,

`71. Remove All Vowels from a String
     String input = "hello world";

        System.out.println(removed);`,

`72. Remove All Consonants from a String

 String input = "hello world";`,

`73. Remove All Digits from a String
    String input = "hello world 124";`,

`74. Remove All Special Characters from a String
 String input = "hello@world 124";`,

`75. Extract All Digits from a String and Sum Them
 String input = "hello world 124";`,

`77. Extract All Unique Words from a String
String input = "hello world hello";`,

`78. Extract All Palindromic Words from a String
String input = "madam racecar apple banana level";`,

`80. Extract All Words Ending with a Specific Letter
String input = "hello world this is a test";`,

`81.Calculate the average for the below integer which are in the strings ?
List<String> scoresAsString = Arrays.asList("85", "92", "78", "90", "88");`,

`82.Find distinct characters in a string. (i)`,

`83.Get the top 3 longest strings from a list.(i)
List<String> list = List.of("ajay", "pargaonkar", "shinde", "nanwate", "kate");`,

`84.Find the average salary of employees.
84.Find the average salary of employees.

List<Employee> list = List.of(new Employee("John", 22, 2000L),
                                  new Employee("Alice", 32, 7000L),
                                  new Employee("Bob", 24, 2000L),
                                  new Employee("Charlie", 22, 8000L));
double average =  list.stream().mapToDouble(Employee::getSalary).average().getAsDouble();`,

`85.Find the employee with the highest salary.
List<Employee> list = List.of(new Employee("John", 22, 2000L),
        new Employee("Alice", 32, 7000L),
        new Employee("Bob", 24, 2000L),
        new Employee("Charlie", 22, 8000L));

Employee employee = list.stream().max(Comparator.comparing(Employee::getSalary)).get();
System.out.println(employee);`,

`86.Filter by value Given Map<String, Integer>, return a map of entries where value > 10.
Map<String, Integer> map = new HashMap<>();
map.put("ajay", 12);
map.put("rushi", 11);
map.put("vicky", 10);
map.put("gajju", 9);`,

`89.Collect keys to a list Extract all keys from a Map<String, Integer> as a List<String>.(i)
    Map<String, Integer> maps = new HashMap<>();
        maps.put("ajay", 2);
        maps.put("gajju", 3);
        maps.put("ankit", 4);`,

`90. Sort map by value ascending Given Map<String, Integer>, return a LinkedHashMap sorted by values ascending.
   Map<String, Integer> maps = new HashMap<>();
        maps.put("ajay", 1);
        maps.put("gajju", 2);
        maps.put("ankit", 3);
        maps.put("zade", 4);
        maps.put("nikita", 5);`,

`91.Find max value Find the entry with the maximum value in a Map<String, Integer>. Need to find max value
 Map<String, Integer> maps = new HashMap<>();
        maps.put("ajay", 1);
        maps.put("gajju", 30);
        maps.put("ankit", 51);
        maps.put("zade", 52);
        maps.put("nikita", 53);`,

`97.Average of values Compute the average of all integer values in a Map<String, Integer>.
      Map<String, Integer> maps = new HashMap<>();
        maps.put("ajay", 1);
        maps.put("gajju", 30);
        maps.put("ankit", 51);
        maps.put("zade", 52);
        maps.put("nikita", 53);`,
];

const QUESTIONS_DESIGN: string[] = [

`Implement a specilized singlton design pattern which can return two instance alternatively`,

  `
  Singleton Design Pattern: Implement a Logger class that follows the singleton design pattern, ensuring that only one instance of the logger exists throughout the application. Include methods for logging messages at different levels (info, warning, error).
  also show the lazay and eager initialization of singleton design pattern

  1. How to make it cloneable free 
  2. How to make it serializable free 
  3. How to make it reflection free
  `,

  "Design a Calculator class that supports basic arithmetic operations (add, subtract, multiply, divide) with proper error handling for division by zero."
];

const QUESTIONS_STACK: string[] = [
`
      Remove All Adjacent Duplicates in String
      Input;- String str = “abbaca”
      bb -> removed 
      aaca -> aa remove
      Output:- "ca"

`,
`
  Backspace String Compare
  Input:
  s = "ab#c", t = "ad#c"
  Because s -> ac removed b (last character needs to remove after #)
  t -> ac -> removed the d (last character needs to remove after #)
  
  ac == ac -> true

  Whatever # will be there that will remove each last character then
  Output:
  true
  
  Input:- 
  s = "ab##"
  t = "c#d#"

  Output:- true

  Input:-
  s = "a##c"
  t = "#a#c"
 
  Output:- true

  problem can be solved using:
1. Stack (O(n) time, O(n) space)
2. Two pointers from the end (O(n) time, O(1) space)
3. Bruit force by building the final string after processing backspaces (O(n) time, O(n) space)


`,

`Remove Stars From a String (the one you mentioned)
Input
s = "leet**cod*e"
Output
"lecoe"

Description:
Given a string s, remove all stars * from the string. In addition, for each star removed, remove the closest non-star character to the left of the star. Return the resulting string after all stars have been removed.

Example 1:
Input: s = "leet**cod*e"
Output: "lecoe"
Explanation: Performing the removals from left to right:
- The closest non-star character to the first star is 't', so we remove 't' and the first star, resulting in "lee*cod*e".
- The closest non-star character to the second star is 'e', so we remove 'e' and the second star, resulting in "lecod*e".
- The closest non-star character to the third star is 'd', so we remove 'd' and the third star, resulting in "lecoe".

Example 2:
Input: s = "erase*****"
Output: ""
Explanation: The entire string is removed, so we return an empty string.

`

  // "Implement a stack using an array. Include methods for push, pop, peek, and isEmpty.",
  // "Implement a stack using a linked list. Include methods for push, pop, peek, and isEmpty.",
  // "Design a stack that supports retrieving the minimum element in constant time. Include methods for push, pop, top, and getMin."
];

export const TOPICS: Topic[] = [
  { id: "basics",    name: "Basic Java (Ground-Up)", questions: QUESTIONS_BASICS },
  { id: "arrays",    name: "Java Arrays",            questions: QUESTIONS_ARRAYS },
  { id: "strings",   name: "Java Strings",           questions: QUESTIONS_STRINGS },
  { id: "recursion", name: "Recursion",              questions: QUESTIONS_RECURSION },
  { id: "streams",   name: "Java 8 Streams",         questions: QUESTIONS_STREAMS },
  { id: "design",    name: "Low Level Designing Questions", questions: QUESTIONS_DESIGN },
  { id: "stack",     name: "Stack",                  questions: QUESTIONS_STACK }
];
