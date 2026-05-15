import sys
import json
import shutil
import tempfile
import os

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No image path provided'}))
        sys.exit(1)

    image_path = sys.argv[1]
    tmp_path = None

    try:
        # Copy to ASCII-safe temp path in case original path has non-ASCII chars
        suffix = os.path.splitext(image_path)[1] or '.jpg'
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=suffix, dir=tempfile.gettempdir())
        os.close(tmp_fd)
        shutil.copy2(image_path, tmp_path)

        from deepface import DeepFace
        result = DeepFace.analyze(
            tmp_path,
            actions=['age', 'gender'],
            enforce_detection=False,
            silent=True,
        )
        if isinstance(result, list):
            result = result[0]

        age = result.get('age')
        raw_gender = result.get('dominant_gender', '')
        gender_map = {'man': 'Male', 'woman': 'Female'}
        gender = gender_map.get(raw_gender.lower()) if raw_gender else None

        print(json.dumps({'age': age, 'gender': gender}))

    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == '__main__':
    main()
