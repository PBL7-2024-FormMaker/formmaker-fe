import { ResponseRow } from '@/molecules/ResponsesTable';

interface OutputObject {
  [key: string]: string | number | undefined;
}

export function transformObjects(input: ResponseRow[]): OutputObject[] {
  const groupedObjects: { [id: string]: OutputObject } = {};

  input.forEach((obj) => {
    const id = obj.id.toString();
    if (!(id in groupedObjects)) {
      groupedObjects[id] = {
        ID: obj.id,
        'Submission Date': obj.createdAt,
      };
    }

    for (const key in obj) {
      if (key.startsWith('NameElement')) {
        const valueKey = key.replace('NameElement', 'ValueElement');
        const name = obj[key as keyof typeof obj];
        const value = obj[valueKey as keyof typeof obj];
        groupedObjects[id][name] = value;
      }
    }
  });

  return Object.values(groupedObjects);
}
