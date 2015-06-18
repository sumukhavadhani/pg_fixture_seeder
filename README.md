# Postgres Fixture Seeder

##Usage

    seeder -f </absolute/path/to/fixtures> -h <host> -p <port> -d <databases -u <user> -x <password> -r [regenerate model files] -m [/absolute/path/to/models]

    Options:
      -f, --fixture     Absolute Path to fixtures folder.
      -h, --host        IP/Hostname for the database.                     [required]
      -p, --port        Port number for database.                         [required]
      -d, --database    Comma separated database names (without white spaces).
                                                                          [required]
      -u, --user        Username for database.                            [required]
      -x, --pass        Password for database.                            [required]
      -r, --regenerate  Regenerate model files.
      -m, --models      Absolute Path to Models folder.

##Fixture file structure

    module.exports = {
      "model": "my model name",
      "database": "my database name",
      "fixtures": [
        {
          "a" : 1,
          "b" : 2,
          ...
        },
        {
          ...
        }
      ]
    };