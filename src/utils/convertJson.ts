type FieldType =
  | "string"
  | "date"
  | "email"
  | "enum"
  | "file"
  | "array"
  | "object";

interface Field {
  required: boolean;
  type: FieldType;
  label: string;
  options?: string[]; // Only for "enum" fields
  items?: Field | Section; // Items can be a Field OR a Section
}

interface Section {
  [fieldName: string]: Field;
}

interface InputJson {
  [sectionName: string]: Section;
}

interface ConvertedField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  fields?: ConvertedField[];
}

interface ConvertedSection {
  section: string;
  fields: ConvertedField[];
}

// ... (inputJson remains the same)

const typeMapping: Record<FieldType, string> = {
  string: "text",
  date: "date",
  email: "email",
  enum: "select",
  file: "file",
  array: "array",
  object: "object",
};

/**
 * Converts an `InputJson` object to an array of `ConvertedSection` objects.
 *
 * @param input The `InputJson` object.
 * @returns An array of `ConvertedSection` objects.
 */
export function convertJson(input: InputJson): ConvertedSection[] {
  const result: ConvertedSection[] = [];

  for (const [sectionName, section] of Object.entries(input)) {
    const convertedSection: ConvertedSection = {
      section: sectionName,
      fields: [],
    };

    for (const [fieldName, field] of Object.entries(section)) {
      const convertedField: ConvertedField = {
        name: fieldName,
        type: typeMapping[field.type] || field.type,
        label: field.label,
        required: field.required,
      };

      if (field.options) {
        convertedField.options = field.options;
      }

      if (field.items) {
        if (field.type === "array") {
          // For arrays, handle the nested Field directly
          const nestedField = field.items as Field; // Type assertion since we know it is a Field
          convertedField.fields = [
            {
              ...convertJson({ items: { item: nestedField } })[0].fields[0],
              name: "item",
            },
          ];
        } else if (field.type === "object") {
          // For objects, recursively convert the nested Section
          const nestedSection = field.items as Section; // Type assertion since we know it is a Section
          const nestedConvertedSection = convertJson({
            [fieldName]: nestedSection,
          })[0];
          convertedField.fields = nestedConvertedSection.fields;
        }
      }

      convertedSection.fields.push(convertedField);
    }

    result.push(convertedSection);
  }

  return result;
}
