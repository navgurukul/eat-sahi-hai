import { supabase } from "./supabase";

// Debug function to test Supabase connection and see actual data structure
export const debugSupabaseConnection = async () => {
  try {
    console.log("=== TESTING SUPABASE CONNECTION ===");

    // Test 1: Check if table exists and get schema
    console.log("Test 1: Getting table schema...");
    const { data: schemaData, error: schemaError } = await supabase
      .from("food_database")
      .select("*")
      .limit(0);

    console.log("Schema check:", { schemaData, schemaError });

    // Test 2: Get total count of records
    console.log("\nTest 2: Getting total record count...");
    const { count, error: countError } = await supabase
      .from("food_database")
      .select("*", { count: "exact", head: true });

    console.log("Total records in database:", { count, countError });

    // Test 3: Get first 10 records without any filters
    console.log("\nTest 3: Fetching first 10 records...");
    const { data: allData, error: allError } = await supabase
      .from("food_database")
      .select("*")
      .limit(10);

    console.log("First 10 records:", { allData, allError });
    console.log("Number of records fetched:", allData?.length || 0);

    if (allData && allData.length > 0) {
      console.log("\n=== SAMPLE RECORD STRUCTURE ===");
      console.log("First record:", allData[0]);
      console.log("Field names:", Object.keys(allData[0]));

      // Test specific fields
      allData.forEach((record, index) => {
        console.log(`Record ${index + 1}:`);
        console.log("  - ID:", record.id);
        console.log("  - Food Name:", record.food_list);
        console.log("  - Portion:", record.portion_size);
        console.log("  - Calories:", record.calories);
      });
    } else {
      console.log("\n❌ NO DATA FOUND IN DATABASE");
    }

    // Test 4: Try different table names (in case of naming issues)
    console.log("\nTest 4: Trying alternative table names...");
    const alternativeNames = ["foods", "food_items", "nutrition_data"];

    for (const tableName of alternativeNames) {
      try {
        const { data: altData, error: altError } = await supabase
          .from(tableName)
          .select("*")
          .limit(1);

        console.log(`Table '${tableName}':`, {
          found: !altError,
          error: altError?.message,
        });
      } catch (e) {
        console.log(`Table '${tableName}': Not found`);
      }
    }

    return {
      success: !allError,
      totalRecords: count || 0,
      sampleData: allData,
      error: allError,
    };
  } catch (error) {
    console.error("❌ Critical error:", error);
    return { success: false, error };
  }
};
