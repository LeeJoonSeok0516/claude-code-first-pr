public class TestClass {
    private String name;

    public TestClass(String name) {
        this.name = new String(name);  // This should be excluded (new String)
    }

    public void printName() {
        System.out.println(name);
    }

    public String getName() {
        return name;
    }

    public static void main(String[] args) {
        TestClass obj = new TestClass("Test");  // This should be excluded (new TestClass)
        obj.printName();
    }
}
