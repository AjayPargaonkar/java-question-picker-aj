export type Difficulty = "easy" | "medium" | "hard" | "tricky";

export type PredictPuzzle = {
  id: string;
  title: string;
  difficulty: Difficulty;
  /** Java source. Must compile and run on Piston. */
  code: string;
  /** Expected stdout (exactly what the program prints). Trailing newline tolerated by comparator. */
  expected: string;
  /** Optional one-line hint that experienced devs would still find subtle. */
  hint?: string;
  /** What the puzzle is teaching — shown after reveal/submit. */
  explanation?: string;
  tags?: string[];
};

const PUZZLES: PredictPuzzle[] = [
  {
    id: "po-001",
    title: "Integer cache trap",
    difficulty: "tricky",
    code: `public class Main {
    public static void main(String[] args) {
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;
        System.out.println(a == b);
        System.out.println(c == d);
    }
}`,
    expected: "true\nfalse\n",
    hint: "Reference comparison. Think about what the JVM caches.",
    explanation:
      "Java caches Integer objects from -128 to 127 (the IntegerCache). a == b compares two cached references → true. c == d are 128, outside the cache, so they are different objects → false.",
    tags: ["autoboxing"],
  },
  {
    id: "po-002",
    title: "String pool vs new",
    difficulty: "easy",
    code: `public class Main {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";
        String c = new String("hello");
        System.out.println(a == b);
        System.out.println(a == c);
        System.out.println(a.equals(c));
    }
}`,
    expected: "true\nfalse\ntrue\n",
    explanation:
      "String literals share the string pool, so a == b is the same reference. new String(\"hello\") forces a new object, so a == c is false. equals() compares character contents.",
    tags: ["strings"],
  },
  {
    id: "po-003",
    title: "Post-increment in expression",
    difficulty: "easy",
    code: `public class Main {
    public static void main(String[] args) {
        int i = 0;
        i = i++;
        System.out.println(i);
    }
}`,
    expected: "0\n",
    hint: "i++ returns the value *before* incrementing.",
    explanation:
      "Steps: read i (0) → schedule increment to 1 → assign back the read value (0). The temporary increment is overwritten by the assignment. Final i = 0.",
    tags: ["operators"],
  },
  {
    id: "po-004",
    title: "Switch fall-through",
    difficulty: "medium",
    code: `public class Main {
    public static void main(String[] args) {
        int x = 2;
        switch (x) {
            case 1: System.out.println("one");
            case 2: System.out.println("two");
            case 3: System.out.println("three");
            default: System.out.println("other");
        }
    }
}`,
    expected: "two\nthree\nother\n",
    explanation:
      "No break statements → fall-through. Once case 2 matches, execution continues into case 3 and default until the switch ends.",
    tags: ["control-flow"],
  },
  {
    id: "po-005",
    title: "Static block order",
    difficulty: "medium",
    code: `public class Main {
    static int x = init();
    static { System.out.println("static block, x=" + x); x = 10; }
    static int init() { System.out.println("init()"); return 5; }
    public static void main(String[] args) {
        System.out.println("main, x=" + x);
    }
}`,
    expected: "init()\nstatic block, x=5\nmain, x=10\n",
    explanation:
      "Class initialization runs static fields and static blocks top-to-bottom. init() runs first (sets x=5), then the static block prints x=5 and reassigns to 10. main() sees x=10.",
    tags: ["initialization"],
  },
  {
    id: "po-006",
    title: "Equality across types",
    difficulty: "tricky",
    code: `public class Main {
    public static void main(String[] args) {
        Long l = 1000L;
        Integer i = 1000;
        System.out.println(l.equals(i));
        System.out.println(l.longValue() == i.intValue());
    }
}`,
    expected: "false\ntrue\n",
    hint: "Long.equals checks the runtime class of the argument.",
    explanation:
      "Long.equals returns false when the argument isn't also a Long, even with the same numeric value. Comparing primitives with == promotes the int to long, so the second print is true.",
    tags: ["wrappers", "equals"],
  },
  {
    id: "po-007",
    title: "Try-finally return",
    difficulty: "medium",
    code: `public class Main {
    static int f() {
        try { return 1; }
        finally { return 2; }
    }
    public static void main(String[] args) {
        System.out.println(f());
    }
}`,
    expected: "2\n",
    hint: "A return inside finally overrides the try's return.",
    explanation:
      "When finally has its own return, it replaces the try block's return value. Generally a code smell — the compiler will warn about it.",
    tags: ["exceptions"],
  },
  {
    id: "po-008",
    title: "Floating point surprises",
    difficulty: "easy",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);
        System.out.println(0.1 + 0.2 == 0.3);
    }
}`,
    expected: "0.30000000000000004\nfalse\n",
    explanation:
      "Doubles use IEEE 754 binary representation. 0.1 and 0.2 cannot be represented exactly, so their sum has a small rounding error. Use BigDecimal for exact decimal math.",
    tags: ["numerics"],
  },
  {
    id: "po-009",
    title: "Array == array",
    difficulty: "easy",
    code: `import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = {1, 2, 3};
        System.out.println(a == b);
        System.out.println(a.equals(b));
        System.out.println(Arrays.equals(a, b));
    }
}`,
    expected: "false\nfalse\ntrue\n",
    explanation:
      "Arrays don't override equals() — they inherit Object.equals which is reference equality. Use Arrays.equals (or Arrays.deepEquals for nested) to compare contents.",
    tags: ["arrays", "equals"],
  },
  {
    id: "po-010",
    title: "Ternary type promotion",
    difficulty: "tricky",
    code: `public class Main {
    public static void main(String[] args) {
        boolean flag = true;
        Object o = flag ? Integer.valueOf(1) : Double.valueOf(2.0);
        System.out.println(o);
    }
}`,
    expected: "1.0\n",
    hint: "The ternary's result type is computed at compile time.",
    explanation:
      "Both branches' types must converge. Integer and Double both unbox to numbers, and the conditional expression's type is promoted to double. So Integer.valueOf(1) becomes 1.0 even though flag=true picks the Integer branch.",
    tags: ["operators", "numerics"],
  },
];

export const PREDICT_OUTPUT_PUZZLES = PUZZLES;
